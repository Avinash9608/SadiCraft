
"use client";

import { useState, useEffect, useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Script from 'next/script';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { FileText, ArrowLeft, Loader2, Star } from 'lucide-react';
import Link from 'next/link';

import { useToast } from "@/hooks/use-toast";
import { AuthContext } from '@/lib/AuthContext';
import { Spinner } from '@/components/Spinner';
import { createOrder, verifyPayment } from '@/app/actions/paymentActions';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const plans = {
  monthly: {
    id: 'plan_monthly_299',
    name: 'Premium Monthly',
    price: 299,
    description: 'Full access to all premium features, billed monthly.'
  },
  yearly: {
    id: 'plan_yearly_2499',
    name: 'Premium Yearly',
    price: 2499,
    description: 'Get the best value with our annual plan.'
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
      // Default to monthly if no plan or invalid plan is specified
      setSelectedPlanKey('monthly');
    }
  }, [searchParams]);

  const handlePayment = async () => {
    setIsLoading(true);

    if (!authContext?.user) {
      toast({ variant: 'destructive', title: 'Not Logged In', description: 'Please log in to make a purchase.' });
      router.push('/login');
      return;
    }
    
    if (!selectedPlanKey) {
        toast({ variant: 'destructive', title: 'No Plan Selected', description: 'Please select a plan before paying.' });
        setIsLoading(false);
        return;
    }

    const planDetails = plans[selectedPlanKey];
    const amountInPaise = planDetails.price * 100;

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

          if (result.success) {
            localStorage.setItem('isPremium', 'true');
            toast({ title: "Payment Successful!", description: "Welcome to Premium! You now have access to all features." });
            // Force a reload of the context by navigating.
            router.push('/create');
            router.refresh();
          } else {
            toast({ variant: 'destructive', title: 'Payment Verification Failed', description: 'Please contact support.' });
          }
        },
        prefill: {
          name: authContext.user.displayName || 'Valued Customer',
          email: authContext.user.email,
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
                        <p className="text-xs text-muted-foreground">{selectedPlanKey === 'yearly' ? '/year' : '/month'}</p>
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
