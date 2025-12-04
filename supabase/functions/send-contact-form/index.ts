import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactFormRequest {
  formType: "contact" | "partnership";
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  organization?: string;
  organizationType?: string;
  subject?: string;
  message?: string;
  partnershipInterest?: string;
  preferredLevel?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ContactFormRequest = await req.json();
    console.log("Received form submission:", data);

    let subject = "";
    let htmlContent = "";

    if (data.formType === "contact") {
      subject = `New Contact Form Submission: ${data.subject || "General Inquiry"}`;
      htmlContent = `
        <h1>New Contact Form Submission</h1>
        <p><strong>From:</strong> ${data.firstName} ${data.lastName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Organization:</strong> ${data.organization || "Not provided"}</p>
        <p><strong>Subject:</strong> ${data.subject || "Not provided"}</p>
        <hr/>
        <h2>Message:</h2>
        <p>${data.message?.replace(/\n/g, "<br/>") || "No message provided"}</p>
        <hr/>
        <p><em>This message was sent from the AE&SC website contact form.</em></p>
      `;
    } else if (data.formType === "partnership") {
      subject = `New Partnership Request from ${data.organization || data.name}`;
      htmlContent = `
        <h1>New Partnership Request</h1>
        <p><strong>Organization:</strong> ${data.organization || "Not provided"}</p>
        <p><strong>Organization Type:</strong> ${data.organizationType || "Not provided"}</p>
        <p><strong>Contact Name:</strong> ${data.name || "Not provided"}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Preferred Partnership Level:</strong> ${data.preferredLevel || "Not specified"}</p>
        <hr/>
        <h2>Partnership Interest:</h2>
        <p>${data.partnershipInterest?.replace(/\n/g, "<br/>") || "No details provided"}</p>
        <hr/>
        <p><em>This request was sent from the AE&SC website partnership form.</em></p>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "AE&SC Website <onboarding@resend.dev>",
      to: ["info@aesc.global"],
      subject: subject,
      html: htmlContent,
      reply_to: data.email,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-form function:", error);
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
