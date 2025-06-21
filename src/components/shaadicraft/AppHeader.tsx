
"use client";

import React, { useContext } from 'react';
import { useRouter } from 'next/navigation';
import type { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import LayoutSelector from './LayoutSelector';
import { Download, FileText, Home, LogOut } from 'lucide-react';
import type { BiodataFormValues } from '@/lib/zod-schemas';
import { Form } from '@/components/ui/form';
import Link from 'next/link';
import { AuthContext } from '@/lib/AuthContext';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface AppHeaderProps {
  form: UseFormReturn<BiodataFormValues>;
  onDownloadPdf: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ form, onDownloadPdf }) => {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push('/');
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
    <header className="py-6 px-4 md:px-8 bg-card border-b border-border shadow-sm no-print">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center">
           <FileText className="h-8 w-8 text-primary mr-2" />
          <h1 className="text-3xl font-headline font-bold text-primary">ShaadiCraft Biodata Maker</h1>
        </div>
        <Form {...form}>
          <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
            <Button variant="ghost" asChild>
                <Link href="/"><Home className="mr-2 h-4 w-4"/> Home</Link>
            </Button>
            <LayoutSelector form={form} />
            <Button onClick={onDownloadPdf} variant="outline" className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            {authContext?.user && (
               <div className="flex items-center gap-4">
                <span className="text-sm font-medium hidden sm:inline">
                    Hi, {authContext.user.displayName?.split(' ')[0] || 'User'}
                </span>
                <Button onClick={handleLogout} variant="destructive" className="w-full sm:w-auto">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
              </div>
            )}
          </div>
        </Form>
      </div>
    </header>
  );
};

export default AppHeader;
