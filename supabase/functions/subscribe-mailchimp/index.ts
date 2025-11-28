import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SubscribeRequest {
  email: string;
  firstName?: string;
  lastName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client to fetch configuration
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch Mailchimp configuration from cms_site_settings
    const { data: settings } = await supabase
      .from('cms_site_settings')
      .select('setting_key, setting_value')
      .in('setting_key', ['MAILCHIMP_API_KEY', 'MAILCHIMP_AUDIENCE_ID', 'MAILCHIMP_SERVER_PREFIX']);

    const settingsMap = (settings || []).reduce((acc: Record<string, string>, item) => {
      acc[item.setting_key] = item.setting_value || '';
      return acc;
    }, {});

    // Use settings from database first, fall back to environment variables
    const MAILCHIMP_API_KEY = settingsMap['MAILCHIMP_API_KEY'] || Deno.env.get("MAILCHIMP_API_KEY");
    const MAILCHIMP_AUDIENCE_ID = settingsMap['MAILCHIMP_AUDIENCE_ID'] || Deno.env.get("MAILCHIMP_AUDIENCE_ID");
    const MAILCHIMP_SERVER_PREFIX = settingsMap['MAILCHIMP_SERVER_PREFIX'] || Deno.env.get("MAILCHIMP_SERVER_PREFIX");

    const { email, firstName, lastName }: SubscribeRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Validate environment variables
    if (!MAILCHIMP_API_KEY || !MAILCHIMP_AUDIENCE_ID || !MAILCHIMP_SERVER_PREFIX) {
      console.error("Missing Mailchimp configuration");
      return new Response(
        JSON.stringify({ error: "Mailchimp configuration is incomplete" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Prepare member data
    const memberData: any = {
      email_address: email,
      status: "subscribed",
    };

    // Add merge fields if names are provided
    if (firstName || lastName) {
      memberData.merge_fields = {
        ...(firstName && { FNAME: firstName }),
        ...(lastName && { LNAME: lastName }),
      };
    }

    // Subscribe to Mailchimp
    const mailchimpUrl = `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`;
    
    console.log("Subscribing email to Mailchimp:", email);

    const response = await fetch(mailchimpUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${MAILCHIMP_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(memberData),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle already subscribed case
      if (data.title === "Member Exists") {
        console.log("Email already subscribed:", email);
        return new Response(
          JSON.stringify({ 
            success: true,
            message: "You're already subscribed to our newsletter!" 
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      console.error("Mailchimp API error:", data);
      return new Response(
        JSON.stringify({ error: data.detail || "Failed to subscribe" }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Successfully subscribed:", email);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Successfully subscribed to newsletter!" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in subscribe-mailchimp function:", error);
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
