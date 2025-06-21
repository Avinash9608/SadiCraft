
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
           <Link href="/" className="flex items-center justify-center gap-2 mb-4">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-headline font-bold text-primary">ShaadiCraft</h1>
          </Link>
          <CardTitle className="text-2xl">Checkout</CardTitle>
          <CardDescription>
            Payment gateway integration is coming soon! This is where users will upgrade to a premium plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            For now, we are demonstrating the locked/unlocked state of premium features.
          </p>
          <Button asChild>
            <Link href="/create">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Biodata Creator
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
