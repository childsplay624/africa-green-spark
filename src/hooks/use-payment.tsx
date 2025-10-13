import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PaymentConfig {
  publicKey: string;
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  planId: string;
}

export function usePayment() {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const initializeFlutterwave = async (config: PaymentConfig) => {
    setIsProcessing(true);
    
    try {
      // This would be replaced with actual Flutterwave implementation
      // For now, it's a placeholder that simulates payment
      const paymentReference = `FLW_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verify the user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("User not authenticated");

      // Call secure edge function to verify and record payment
      // This prevents users from forging payment records in the browser console
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: {
          paymentMethod: 'flutterwave',
          transactionReference: paymentReference,
          planId: config.planId,
          amount: config.amount,
          currency: config.currency
        }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'Payment verification failed');

      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully.",
      });

      return { success: true, reference: paymentReference };
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setIsProcessing(false);
    }
  };

  const initializePaystack = async (config: PaymentConfig) => {
    setIsProcessing(true);
    
    try {
      // This would be replaced with actual Paystack implementation
      // For now, it's a placeholder that simulates payment
      const paymentReference = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verify the user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("User not authenticated");

      // Call secure edge function to verify and record payment
      // This prevents users from forging payment records in the browser console
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: {
          paymentMethod: 'paystack',
          transactionReference: paymentReference,
          planId: config.planId,
          amount: config.amount,
          currency: config.currency
        }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'Payment verification failed');

      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully.",
      });

      return { success: true, reference: paymentReference };
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    initializeFlutterwave,
    initializePaystack,
    isProcessing
  };
}