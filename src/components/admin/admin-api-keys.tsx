import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Key, Eye, EyeOff, Save } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

type KeyType = "resend" | "flutterwave" | "paystack" | "mailchimp_api" | "mailchimp_server" | "mailchimp_audience";

export function AdminApiKeys() {
  const { toast } = useToast();
  const [showKeys, setShowKeys] = useState<Record<KeyType, boolean>>({
    resend: false,
    flutterwave: false,
    paystack: false,
    mailchimp_api: false,
    mailchimp_server: false,
    mailchimp_audience: false,
  });
  
  const [apiKeys, setApiKeys] = useState<Record<KeyType, string>>({
    resend: "",
    flutterwave: "",
    paystack: "",
    mailchimp_api: "",
    mailchimp_server: "",
    mailchimp_audience: "",
  });

  const [saving, setSaving] = useState<Record<KeyType, boolean>>({
    resend: false,
    flutterwave: false,
    paystack: false,
    mailchimp_api: false,
    mailchimp_server: false,
    mailchimp_audience: false,
  });

  const handleSave = async (keyType: KeyType) => {
    const keyValue = apiKeys[keyType];
    
    if (!keyValue.trim()) {
      toast({
        title: "Validation Error",
        description: "API key cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setSaving({ ...saving, [keyType]: true });

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-api-keys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ keyType, keyValue }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update API key');
      }
      
      toast({
        title: "Success",
        description: `API key updated successfully`,
      });
      
      // Clear the input after successful save
      setApiKeys({ ...apiKeys, [keyType]: "" });
      setShowKeys({ ...showKeys, [keyType]: false });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update API key",
        variant: "destructive",
      });
    } finally {
      setSaving({ ...saving, [keyType]: false });
    }
  };

  const KeyInputSection = ({
    title,
    description,
    keyType,
    placeholder,
  }: {
    title: string;
    description: string;
    keyType: KeyType;
    placeholder: string;
  }) => (
    <div className="space-y-4 p-4 border rounded-lg">
      <div>
        <h3 className="font-semibold flex items-center gap-2">
          <Key className="h-4 w-4" />
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${keyType}-key`}>API Key</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              id={`${keyType}-key`}
              type={showKeys[keyType] ? "text" : "password"}
              placeholder={placeholder}
              value={apiKeys[keyType]}
              onChange={(e) => setApiKeys({ ...apiKeys, [keyType]: e.target.value })}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowKeys({ ...showKeys, [keyType]: !showKeys[keyType] })}
            >
              {showKeys[keyType] ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Button
            onClick={() => handleSave(keyType)}
            disabled={saving[keyType] || !apiKeys[keyType].trim()}
          >
            <Save className="h-4 w-4 mr-2" />
            {saving[keyType] ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Keys Management</CardTitle>
          <CardDescription>
            Securely manage API keys for external services. These keys are stored as encrypted secrets.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertDescription>
              <strong>Security Note:</strong> API keys are sensitive credentials. Keep them secure and never share them publicly.
              Keys are encrypted and stored in secure backend storage.
            </AlertDescription>
          </Alert>

          <KeyInputSection
            title="Resend API Key"
            description="Used for sending email notifications (forum activity, alerts, etc.)"
            keyType="resend"
            placeholder="re_..."
          />

          <KeyInputSection
            title="Flutterwave Secret Key"
            description="Used for processing payments via Flutterwave payment gateway"
            keyType="flutterwave"
            placeholder="FLWSECK-..."
          />

          <KeyInputSection
            title="Paystack Secret Key"
            description="Used for processing payments via Paystack payment gateway"
            keyType="paystack"
            placeholder="sk_..."
          />

          <div className="pt-4 border-t">
            <h4 className="font-semibold text-lg mb-4">Mailchimp Configuration</h4>
            <div className="space-y-6">
              <KeyInputSection
                title="Mailchimp API Key"
                description="Your Mailchimp API key for newsletter subscriptions"
                keyType="mailchimp_api"
                placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us19"
              />

              <KeyInputSection
                title="Mailchimp Server Prefix"
                description="The server prefix from your Mailchimp API key (e.g., us19, us20)"
                keyType="mailchimp_server"
                placeholder="us19"
              />

              <KeyInputSection
                title="Mailchimp Audience ID"
                description="The List ID / Audience ID where subscribers will be added"
                keyType="mailchimp_audience"
                placeholder="xxxxxxxxxx"
              />
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Documentation Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                • <a href="https://resend.com/docs" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Resend Documentation</a>
              </li>
              <li>
                • <a href="https://developer.flutterwave.com/docs" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Flutterwave API Docs</a>
              </li>
              <li>
                • <a href="https://paystack.com/docs/api" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Paystack API Docs</a>
              </li>
              <li>
                • <a href="https://mailchimp.com/developer/marketing/guides/quick-start/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mailchimp API Docs</a>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
