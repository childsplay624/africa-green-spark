import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  notificationId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { notificationId }: EmailRequest = await req.json();

    if (!notificationId) {
      throw new Error("Notification ID is required");
    }

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!supabaseUrl || !supabaseServiceKey || !resendApiKey) {
      throw new Error("Missing environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = new Resend(resendApiKey);

    // Fetch notification details
    const { data: notification, error: notifError } = await supabase
      .from("notifications")
      .select(`
        *,
        user:aesc_profiles!notifications_user_id_fkey(email, full_name)
      `)
      .eq("id", notificationId)
      .single();

    if (notifError || !notification) {
      console.error("Error fetching notification:", notifError);
      throw new Error("Notification not found");
    }

    const userEmail = notification.user.email;
    const userName = notification.user.full_name || userEmail;

    // Prepare email content based on notification type
    let emailSubject = notification.title;
    let emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">AESC</h1>
          <p style="color: white; margin: 10px 0 0 0;">African Energy Storage Consortium</p>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937; margin-top: 0;">Hello ${userName},</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            ${notification.message}
          </p>
          
          ${notification.link ? `
            <div style="margin: 30px 0;">
              <a href="${supabaseUrl.replace('/supabase', '')}${notification.link}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 12px 30px; 
                        text-decoration: none; 
                        border-radius: 6px; 
                        display: inline-block;
                        font-weight: 600;">
                View Discussion
              </a>
            </div>
          ` : ''}
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            You're receiving this email because you're subscribed to forum notifications. 
            You can manage your notification preferences in your profile settings.
          </p>
        </div>
        
        <div style="padding: 20px; text-align: center; background: #e5e7eb; color: #6b7280; font-size: 12px;">
          <p style="margin: 0;">© ${new Date().getFullYear()} African Energy Storage Consortium. All rights reserved.</p>
        </div>
      </div>
    `;

    // Send email via Resend
    const { error: emailError } = await resend.emails.send({
      from: "AESC Forum <notifications@resend.dev>",
      to: [userEmail],
      subject: emailSubject,
      html: emailHtml,
    });

    if (emailError) {
      console.error("Error sending email:", emailError);
      throw emailError;
    }

    console.log(`Email sent successfully to ${userEmail} for notification ${notificationId}`);

    return new Response(
      JSON.stringify({ success: true, email: userEmail }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-forum-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
