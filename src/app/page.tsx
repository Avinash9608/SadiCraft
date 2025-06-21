
"use client";

import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import FeatureTable from '@/components/shaadicraft/FeatureTable';
import PricingCard from '@/components/shaadicraft/PricingCard';
import { FileText, ArrowRight, Star, Video, MessageCircle, BarChart, LogOut, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { AuthContext } from '@/lib/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { Spinner } from '@/components/Spinner';

export default function LandingPage() {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('isPremium'); // Clear premium status on logout
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error("Logout Error:", error);
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "There was an issue logging you out. Please try again.",
      });
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="py-4 px-4 md:px-8 bg-card border-b border-border shadow-sm sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-headline font-bold text-primary">ShaadiCraft</h1>
          </Link>
          <div className="flex items-center gap-2">
             {authContext?.loading ? (
                <Spinner className="h-6 w-6" />
              ) : authContext?.user ? (
                <>
                  <span className="text-sm font-medium hidden sm:inline">
                    Welcome, {authContext.user.displayName?.split(' ')[0] || 'User'}
                  </span>
                   <Button variant="outline" asChild>
                      <Link href="/create"><UserIcon className="mr-2" /> My Biodata</Link>
                  </Button>
                  <Button variant="ghost" onClick={handleLogout}>
                      <LogOut className="mr-2" /> Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                      <Link href="/login">Log In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register">Create Free Biodata</Link>
                  </Button>
                </>
              )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="text-center py-20 md:py-32 bg-secondary/30">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-6xl font-extrabold font-headline text-primary mb-4">
              Find Your Perfect Match in Bihar & UP
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              The trusted matrimony platform for creating beautiful biodatas and connecting with your ideal partner.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href={authContext?.user ? '/create' : '/register'}>
                  Get Started for Free <ArrowRight className="ml-2" />
                </Link>
              </Button>
               <Button size="lg" variant="outline" asChild>
                 <a href="#pricing">Explore Premium Plans</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Ad Placeholder */}
        <section className="py-8">
          <div className="container mx-auto flex justify-center">
            <div className="w-[728px] h-[90px] bg-muted/50 flex items-center justify-center border border-dashed rounded-lg">
              <p className="text-muted-foreground">Advertisement (728x90)</p>
            </div>
          </div>
        </section>

        {/* Feature Comparison Section */}
        <section id="features" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold font-headline text-foreground">
                Choose Your Perfect Plan
              </h3>
              <p className="text-md text-muted-foreground mt-2">
                Start for free and upgrade for exclusive benefits and better results.
              </p>
            </div>
            <FeatureTable />
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 md:py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold font-headline text-foreground">
                Unlock Your Path to Marriage
              </h3>
              <p className="text-md text-muted-foreground mt-2">
                Simple, transparent pricing for every need.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
               <PricingCard
                title="Free"
                price="₹0"
                description="Get started and create your basic profile."
                features={[
                  "Basic Profile Creation",
                  "View 5 Profiles/Day",
                  "Send 3 Interests/Month",
                  "Basic Search Filters",
                  "Ad-Supported",
                ]}
                buttonText="Start for Free"
                buttonVariant="outline"
                buttonLink={authContext?.user ? '/create' : '/register'}
              />
              <PricingCard
                title="Silver"
                price="₹299"
                period="/month"
                description="Unlock core premium features."
                features={[
                  "Unlimited Profile Views",
                  "Unlimited Interests",
                  "View Contact Details",
                  "Priority Listing",
                  "Advanced Filters",
                  "Ad-Free Experience",
                  "Verified Profile Badge",
                  "All Biodata Templates",
                ]}
                buttonText="Choose Silver"
                buttonLink="/checkout?plan=silver"
                isPopular
              />
              <PricingCard
                title="Gold"
                price="₹2,499"
                period="/year"
                description="Best value for serious seekers."
                features={[
                    "All Silver Features",
                    "Video Profile Upload",
                    "SMS/WhatsApp Match Alerts",
                    "5 Free Astro Reports",
                    "Best value (Save 30%)"
                ]}
                buttonText="Choose Gold"
                buttonLink="/checkout?plan=gold"
              />
               <PricingCard
                title="Platinum"
                price="₹4,999"
                period="/lifetime"
                description="One-time payment for lifetime access."
                features={[
                  "All Gold Features",
                  "Lifetime Validity",
                  "1 Profile Boost Every Month",
                  "Dedicated Relationship Manager (First 3 months)",
                ]}
                buttonText="Go Platinum"
                buttonLink="/checkout?plan=platinum"
              />
            </div>
          </div>
        </section>
        
        {/* New Premium Features Section */}
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h3 className="text-3xl md:text-4xl font-bold font-headline text-foreground">Exclusive Premium Add-ons</h3>
                    <p className="text-md text-muted-foreground mt-2">Take your search to the next level.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="text-center p-6 bg-card rounded-lg shadow-sm">
                        <Video className="mx-auto h-12 w-12 text-primary mb-4" />
                        <h4 className="text-xl font-semibold mb-2">Video Profiles</h4>
                        <p className="text-muted-foreground">Upload a 1-min intro video to show your personality.</p>
                    </div>
                     <div className="text-center p-6 bg-card rounded-lg shadow-sm">
                        <BarChart className="mx-auto h-12 w-12 text-primary mb-4" />
                        <h4 className="text-xl font-semibold mb-2">Profile Boosts (₹50)</h4>
                        <p className="text-muted-foreground">Highlight your profile in search results for 24 hours.</p>
                    </div>
                    <div className="text-center p-6 bg-card rounded-lg shadow-sm">
                        <Star className="mx-auto h-12 w-12 text-primary mb-4" />
                        <h4 className="text-xl font-semibold mb-2">Astro Matching (₹99)</h4>
                        <p className="text-muted-foreground">Get AI-powered horoscope compatibility reports.</p>
                    </div>
                </div>
            </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="text-center p-6 text-sm text-muted-foreground border-t border-border bg-card">
        <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                 <p>&copy; {new Date().getFullYear()} ShaadiCraft. All rights reserved.</p>
                 <div className="flex gap-4">
                    <Link href="#" className="hover:text-primary">About Us</Link>
                    <Link href="#" className="hover:text-primary">Contact</Link>
                    <Link href="#" className="hover:text-primary">Terms of Service</Link>
                    <Link href="#" className="hover:text-primary">Privacy Policy</Link>
                 </div>
            </div>
        </div>
      </footer>
    </div>
  );
}
