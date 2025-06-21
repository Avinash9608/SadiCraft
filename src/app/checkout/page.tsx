
"use client";

import { useState, useEffect, useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Script from 'next/script';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { FileText, ArrowLeft, Loader2, Star } from 'lucide-react';
import Link from 'next/link';

import { useToast } from "@/hooks/use-toast";
import { AuthContext, type SubscriptionData } from '@/lib/AuthContext';
import { Spinner } from '@/components/Spinner';
import { createOrder, verifyPayment } from '@/app/actions/paymentActions';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const plans = {
  silver: {
    id: 'plan_silver_monthly',
    name: 'Silver Plan',
    price: 299,
    period: '/month',
    description: 'Unlock core premium features for 30 days.'
  },
  gold: {
    id: 'plan_gold_yearly',
    name: 'Gold Plan',
    price: 2499,
    period: '/year',
    description: 'Best value with all features for a full year.'
  },
  platinum: {
    id: 'plan_platinum_lifetime',
    name: 'Platinum Plan',
    price: 4999,
    period: 'one-time',
    description: 'Lifetime access and exclusive monthly perks.'
  }
};


type PlanKey = keyof typeof plans;

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const authContext = useContext(AuthContext);

  const [selectedPlanKey, setSelectedPlanKey] = useState<PlanKey | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const plan = searchParams.get('plan') as PlanKey;
    if (plan && plans[plan]) {
      setSelectedPlanKey(plan);
    } else {
      setSelectedPlanKey('silver');
    }
  }, [searchParams]);

  const handlePayment = async () => {
    setIsLoading(true);

    if (!authContext?.user || !authContext.updateSubscription) {
      toast({ variant: 'destructive', title: 'Not Logged In', description: 'Please log in to make a purchase.' });
      if (!authContext.user) router.push('/login');
      setIsLoading(false);
      return;
    }
    
    if (!selectedPlanKey) {
        toast({ variant: 'destructive', title: 'No Plan Selected', description: 'Please select a plan before paying.' });
        setIsLoading(false);
        return;
    }

    const planDetails = plans[selectedPlanKey];
    const amountInPaise = planDetails.price * 100;
    const returnToLayout = searchParams.get('return_to_layout');

    try {
      const order = await createOrder(amountInPaise);

      if (!order) {
        throw new Error("Order creation failed.");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "ShaadiCraft",
        description: `${planDetails.name} Membership`,
        order_id: order.id,
        handler: async function (response: any) {
          const verificationData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };

          const result = await verifyPayment(verificationData);

          if (result.success && selectedPlanKey) {
            const now = new Date();
            let expiryDate: string | null = null; // Default to null

            if (selectedPlanKey === 'platinum') {
              expiryDate = 'lifetime';
            } else if (selectedPlanKey === 'silver') {
              const expiry = new Date(now);
              expiry.setDate(expiry.getDate() + 30);
              expiryDate = expiry.toISOString();
            } else if (selectedPlanKey === 'gold') {
               const expiry = new Date(now);
               expiry.setFullYear(expiry.getFullYear() + 1);
               expiryDate = expiry.toISOString();
            }
            
            const subscriptionData: SubscriptionData = {
              plan: selectedPlanKey,
              purchaseDate: now.toISOString(),
              expiry: expiryDate,
              paymentId: response.razorpay_payment_id,
            };

            authContext.updateSubscription(subscriptionData);
            
            toast({ title: "Payment Successful!", description: `Welcome to the ${planDetails.name}! You now have access to all its features.` });
            
            const redirectUrl = returnToLayout ? `/create?layout=${returnToLayout}` : '/create';
            router.push(redirectUrl);

          } else {
            toast({ variant: 'destructive', title: 'Payment Verification Failed', description: 'Please contact support.' });
          }
        },
        prefill: {
          name: authContext.user.displayName || 'Valued Customer',
          email: authContext.user.email || '',
        },
        theme: {
          color: '#000080',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        console.error(response.error);
        toast({
          variant: "destructive",
          title: "Payment Failed",
          description: response.error.description || 'An unknown error occurred.',
        });
      });
      rzp.open();

    } catch (error) {
      console.error("Payment error:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not initiate payment. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (authContext?.loading || !selectedPlanKey) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  const selectedPlan = plans[selectedPlanKey];

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Link href="/" className="flex items-center justify-center gap-2 mb-4">
              <FileText className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-headline font-bold text-primary">ShaadiCraft</h1>
            </Link>
            <CardTitle className="text-2xl">Complete Your Purchase</CardTitle>
            <CardDescription>
              You're one step away from unlocking premium benefits.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border bg-card p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-lg">{selectedPlan.name}</h3>
                        <p className="text-sm text-muted-foreground">{selectedPlan.description}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold">₹{selectedPlan.price}</p>
                        <p className="text-xs text-muted-foreground">{selectedPlan.period}</p>
                    </div>
                </div>
            </div>

            <p className="text-sm text-center text-muted-foreground">
              You will be redirected to Razorpay's secure payment gateway.
            </p>

            <Button onClick={handlePayment} className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Star className="mr-2 h-4 w-4" />
              )}
              Pay ₹{selectedPlan.price} Securely
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
             <Button asChild variant="outline" className="w-full">
                <Link href="/create">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Biodata Creator
                </Link>
             </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
