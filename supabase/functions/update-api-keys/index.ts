import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Check if user is admin
    const { data: roles, error: roleError } = await supabase
      .rpc('has_role', { _user_id: user.id, _role: 'admin' });

    if (roleError || !roles) {
      throw new Error('Unauthorized: Admin access required');
    }

    const { keyType, keyValue } = await req.json();

    if (!keyType || !keyValue) {
      throw new Error('Missing required fields: keyType and keyValue');
    }

    // Map keyType to actual secret names
    const secretNameMap: Record<string, string> = {
      'resend': 'RESEND_API_KEY',
      'flutterwave': 'FLUTTERWAVE_SECRET_KEY',
      'paystack': 'PAYSTACK_SECRET_KEY',
      'mailchimp_api': 'MAILCHIMP_API_KEY',
      'mailchimp_server': 'MAILCHIMP_SERVER_PREFIX',
      'mailchimp_audience': 'MAILCHIMP_AUDIENCE_ID',
    };

    const secretName = secretNameMap[keyType];
    if (!secretName) {
      throw new Error(`Invalid keyType: ${keyType}`);
    }

    // Note: In production, you would use Supabase's secrets management API
    // For now, we'll store in a secure settings table
    const { error: updateError } = await supabase
      .from('cms_site_settings')
      .upsert({
        setting_key: secretName,
        setting_value: keyValue,
      }, {
        onConflict: 'setting_key'
      });

    if (updateError) {
      throw updateError;
    }

    return new Response(
      JSON.stringify({ success: true, message: 'API key updated successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
