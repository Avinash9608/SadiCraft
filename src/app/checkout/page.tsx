
"use client";

import { useState, useEffect, useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Script from 'next/script';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { FileText, ArrowLeft, Loader2, Star } from 'lucide-react';
import Link from 'next/link';

import { useToast } from "@/hooks/use-toast";
import { AuthContext, type Plan } from '@/lib/AuthContext';
import { Spinner } from '@/components/Spinner';
import { createOrder, verifyPayment } from '@/app/actions/paymentActions';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const products = {
  silver: {
    id: 'plan_silver_yearly',
    name: 'Silver Plan',
    price: 999,
    period: '/year',
    description: 'Unlock core premium features for one year.',
    icon: Star,
  },
  gold: {
    id: 'plan_gold_yearly',
    name: 'Gold Plan',
    price: 2499,
    period: '/year',
    description: 'Best value with all features for a full year.',
    icon: Star,
  },
  platinum: {
    id: 'plan_platinum_lifetime',
    name: 'Platinum Plan',
    price: 4999,
    period: 'one-time',
    description: 'Lifetime access and exclusive monthly perks.',
    icon: Star,
  },
};

type ProductKey = keyof typeof products;

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const authContext = useContext(AuthContext);

  const [selectedProductKey, setSelectedProductKey] = useState<ProductKey | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { isPremium, loading: authLoading } = authContext ?? {};

  // Redirect if user is already premium.
  useEffect(() => {
    if (!authLoading && isPremium) {
      toast({
        title: "Already Subscribed",
        description: "You already have an active premium plan.",
      });
      router.push('/create');
    }
  }, [isPremium, authLoading, router, toast]);

  useEffect(() => {
    const plan = searchParams.get('plan') as ProductKey;

    if (plan && products[plan]) {
      setSelectedProductKey(plan);
    } else {
      router.push('/#pricing');
    }
  }, [searchParams, router]);

  const handlePayment = async () => {
    setIsLoading(true);

    if (!authContext?.user || !authContext.updateUserPlan) {
      toast({ variant: 'destructive', title: 'Not Logged In', description: 'Please log in to make a purchase.' });
      if (!authContext?.user) router.push('/login');
      setIsLoading(false);
      return;
    }
    
    if (!selectedProductKey) {
        toast({ variant: 'destructive', title: 'No Plan Selected', description: 'Please select a plan before paying.' });
        setIsLoading(false);
        return;
    }

    const productDetails = products[selectedProductKey];
    const amountInPaise = productDetails.price * 100;

    try {
      const order = await createOrder(amountInPaise);
      if (!order) throw new Error("Order creation failed.");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "ShaadiCraft",
        description: `Purchase of ${productDetails.name}`,
        order_id: order.id,
        handler: async function (response: any) {
          setIsLoading(true);
          try {
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };
            const result = await verifyPayment(verificationData);

            if (result.success && selectedProductKey) {
              const plan = selectedProductKey as Plan;
              await authContext.updateUserPlan(plan, response.razorpay_payment_id);
              toast({ title: "Payment Successful!", description: `Welcome to the ${productDetails.name}! Your features are now active.` });
              router.push('/create');
            } else {
              toast({ variant: 'destructive', title: 'Payment Verification Failed', description: result.message || 'Please contact support.' });
              setIsLoading(false);
            }
          } catch (handlerError: any) {
              console.error("Error in payment handler:", handlerError);
              toast({ variant: 'destructive', title: 'Error', description: handlerError.message || 'An unexpected error occurred after payment. Please contact support.' });
              setIsLoading(false);
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
      rzp.on('payment.failed', (response: any) => {
        console.error(response.error);
        toast({ variant: "destructive", title: "Payment Failed", description: response.error.description || 'An unknown error occurred.' });
        setIsLoading(false);
      });
      rzp.open();
       setIsLoading(false); // Enable button again after rzp.open() is called

    } catch (error) {
      console.error("Payment error:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not initiate payment. Please try again.' });
      setIsLoading(false);
    }
  };
  
  if (authLoading || !selectedProductKey) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  const selectedProduct = products[selectedProductKey];
  const Icon = selectedProduct.icon;

  return (
    <>
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Link href="/" className="flex items-center justify-center gap-2 mb-4">
              <FileText className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-headline font-bold text-primary">ShaadiCraft</h1>
            </Link>
            <CardTitle className="text-2xl">Complete Your Purchase</CardTitle>
            <CardDescription>You're one step away from unlocking your selection.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border bg-card p-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                       <Icon className="h-8 w-8 text-primary" />
                        <div>
                            <h3 className="font-bold text-lg">{selectedProduct.name}</h3>
                            <p className="text-sm text-muted-foreground">{selectedProduct.description}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold">₹{selectedProduct.price}</p>
                        <p className="text-xs text-muted-foreground">{selectedProduct.period}</p>
                    </div>
                </div>
            </div>
            <p className="text-sm text-center text-muted-foreground">You will be redirected to Razorpay's secure payment gateway.</p>
            <Button onClick={handlePayment} className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Star className="mr-2 h-4 w-4" />}
              Pay ₹{selectedProduct.price} Securely
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
