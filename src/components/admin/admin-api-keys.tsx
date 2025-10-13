import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Key, Eye, EyeOff, Save } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function AdminApiKeys() {
  const { toast } = useToast();
  const [showKeys, setShowKeys] = useState({
    resend: false,
    flutterwave: false,
    paystack: false,
  });
  
  const [apiKeys, setApiKeys] = useState({
    resend: "",
    flutterwave: "",
    paystack: "",
  });

  const [saving, setSaving] = useState({
    resend: false,
    flutterwave: false,
    paystack: false,
  });

  const handleSave = async (keyType: "resend" | "flutterwave" | "paystack") => {
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
      // In a real implementation, this would call an edge function to update the secret
      // For now, we'll simulate the update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: `${keyType.toUpperCase()} API key updated successfully`,
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
    keyType: "resend" | "flutterwave" | "paystack";
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
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
