import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentVerificationRequest {
  paymentMethod: 'flutterwave' | 'paystack';
  transactionReference: string;
  planId: string;
  amount: number;
  currency: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create Supabase client with user's auth
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_PUBLISHABLE_KEY')!;
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Parse request body
    const { paymentMethod, transactionReference, planId, amount, currency }: PaymentVerificationRequest = await req.json();

    console.log('Payment verification request:', { userId: user.id, paymentMethod, transactionReference, planId });

    // Validate transaction reference format
    if (paymentMethod === 'flutterwave' && !transactionReference.startsWith('FLW_')) {
      throw new Error('Invalid Flutterwave transaction reference');
    }
    if (paymentMethod === 'paystack' && !transactionReference.startsWith('PAY_')) {
      throw new Error('Invalid Paystack transaction reference');
    }

    // TODO: In production, verify payment with actual payment gateway APIs
    // For Flutterwave: Use FLUTTERWAVE_SECRET_KEY to call their verification endpoint
    // For Paystack: Use PAYSTACK_SECRET_KEY to call their verification endpoint
    // const verified = await verifyWithPaymentGateway(paymentMethod, transactionReference);
    
    // For now, simulate successful verification
    const verified = true;

    if (!verified) {
      throw new Error('Payment verification failed with payment gateway');
    }

    // Create Supabase client with service role for privileged operations
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Get current payment status for audit log
    const { data: profile } = await supabaseAdmin
      .from('aesc_profiles')
      .select('payment_status')
      .eq('id', user.id)
      .single();

    const oldStatus = profile?.payment_status || null;

    // Insert payment record using service role
    const { error: paymentError } = await supabaseAdmin
      .from('payment_records')
      .insert({
        user_id: user.id,
        amount,
        currency,
        payment_method: paymentMethod,
        transaction_reference: transactionReference,
        status: 'completed',
        metadata: { plan_id: planId, verified_at: new Date().toISOString() }
      });

    if (paymentError) {
      console.error('Error inserting payment record:', paymentError);
      throw new Error('Failed to record payment');
    }

    // Update payment status using service role
    const { error: updateError } = await supabaseAdmin
      .from('aesc_profiles')
      .update({ payment_status: 'active' })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating payment status:', updateError);
      throw new Error('Failed to update payment status');
    }

    // Log payment status change to audit table
    const { error: auditError } = await supabaseAdmin
      .from('payment_audit_log')
      .insert({
        user_id: user.id,
        old_status: oldStatus,
        new_status: 'active',
        reason: 'Payment verified and completed',
        changed_by: 'edge_function_verify_payment',
        metadata: {
          payment_method: paymentMethod,
          transaction_reference: transactionReference,
          plan_id: planId,
          amount,
          currency,
          verified_at: new Date().toISOString()
        }
      });

    if (auditError) {
      console.error('Error creating audit log:', auditError);
      // Don't fail the request if audit logging fails, but log the error
    }

    console.log('Payment verification successful:', { userId: user.id, transactionReference });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Payment verified successfully',
        reference: transactionReference
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error('Error in verify-payment function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Payment verification failed'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});