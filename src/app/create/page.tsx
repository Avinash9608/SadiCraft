
"use client";

import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { biodataSchema, type BiodataFormValues, defaultBiodataValues } from '@/lib/zod-schemas';
import { AuthContext } from '@/lib/AuthContext';
import { Spinner } from '@/components/Spinner';

import AppHeader from '@/components/shaadicraft/AppHeader';
import BiodataForm from '@/components/shaadicraft/BiodataForm';
import BiodataPreview from '@/components/shaadicraft/BiodataPreview';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button';

export default function ShaadiCraftPage() {
  const router = useRouter();
  const authContext = useContext(AuthContext);

  const form = useForm<BiodataFormValues>({
    resolver: zodResolver(biodataSchema),
    defaultValues: defaultBiodataValues,
    mode: 'onChange', 
  });

  const watchedValues = form.watch();
  const { formState: { isDirty }, reset, setValue, getValues } = form;
  const { toast } = useToast();
  const [isUpgradeAlertOpen, setUpgradeAlertOpen] = useState(false);

  const triggerPdfDownload = useCallback(async (layout: 'modern' | 'traditional') => {
    if (typeof window !== 'undefined') {
      const html2pdf = (await import('html2pdf.js')).default;

      const originalLayout = getValues('layout');
      if (originalLayout !== layout) {
        setValue('layout', layout, { shouldDirty: true });
        await new Promise(resolve => setTimeout(resolve, 100)); 
      }

      const element = document.getElementById('biodata-preview-content');
      const currentData = getValues();

      if (element && html2pdf) {
        const filename = currentData.fullName
          ? `${currentData.fullName.replace(/\s+/g, '_')}_Biodata_${layout}.pdf`
          : `biodata_${layout}.pdf`;

        const opt = {
          margin:       0.5,
          filename:     filename,
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2, useCORS: true, logging: false, letterRendering: true },
          jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        
        try {
          await html2pdf().from(element).set(opt).save();
        } catch (err: any) {
            console.error("Error generating PDF:", err);
            toast({
              variant: "destructive",
              title: "PDF Generation Failed",
              description: "There was an error generating the PDF. Please try again.",
            });
        } finally {
            if (originalLayout !== layout) {
              setValue('layout', originalLayout);
            }
        }
      }
    }
  }, [getValues, setValue, toast]);

  const handleDownloadPdf = useCallback(async () => {
    if (!authContext?.features) return;
    
    const layout = getValues('layout');
    
    if (authContext.features.allTemplates) {
      triggerPdfDownload(layout);
    } else {
       if (layout === 'modern') {
         triggerPdfDownload('modern');
      } else {
         setUpgradeAlertOpen(true);
      }
    }
  }, [authContext, getValues, triggerPdfDownload]);


  // Load data from sessionStorage on component mount
  useEffect(() => {
    try {
      const savedData = sessionStorage.getItem('biodataFormData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        reset(parsedData);
      }
    } catch (error) {
      console.error("Failed to load form data from session storage", error);
      sessionStorage.removeItem('biodataFormData');
    }
  }, [reset]);

  // Save data to sessionStorage whenever it changes and is dirty
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
       if (isDirty) {
        sessionStorage.setItem('biodataFormData', JSON.stringify(value));
      }
    });
    return () => subscription.unsubscribe();
  }, [form, isDirty]);

  // Auth Guard
  useEffect(() => {
    if (authContext && !authContext.loading && !authContext.user) {
      router.push('/login');
    }
  }, [authContext, router]);

  if (authContext?.loading || !authContext?.user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col min-h-screen bg-background">
        <AppHeader form={form} onDownloadPdf={handleDownloadPdf} />
        <main className="flex-grow container mx-auto py-4 px-2 md:px-0">
          <div className="flex flex-col lg:flex-row lg:space-x-6 h-full">
            <ScrollArea className="w-full lg:w-1/2 h-auto lg:max-h-[calc(100vh-150px)] no-print mb-6 lg:mb-0">
              <div className="p-1 md:p-4 rounded-lg">
                {(!authContext?.features?.adFree) && (
                   <div className="mb-6">
                    <div className="w-[300px] h-[250px] mx-auto bg-muted/50 flex items-center justify-center border border-dashed rounded-lg">
                      <p className="text-muted-foreground text-center">Advertisement<br/>(300x250)</p>
                    </div>
                  </div>
                )}
                <BiodataForm form={form} />
              </div>
            </ScrollArea>
            <ScrollArea className="w-full lg:w-1/2 h-auto lg:max-h-[calc(100vh-150px)]">
               <div className="p-1 md:p-4 rounded-lg" id="biodata-preview-container">
                <BiodataPreview data={watchedValues} isDirty={isDirty} />
              </div>
            </ScrollArea>
          </div>
        </main>
        <footer className="text-center p-4 text-sm text-muted-foreground border-t border-border no-print">
          &copy; {new Date().getFullYear()} ShaadiCraft. All rights reserved.
        </footer>
      </div>

       <AlertDialog open={isUpgradeAlertOpen} onOpenChange={setUpgradeAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Upgrade to Premium</AlertDialogTitle>
            <AlertDialogDescription>
              To download the beautiful traditional layout, please upgrade to a Silver plan or higher. This will unlock all premium templates and features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button onClick={() => router.push('/checkout?plan=silver')}>Upgrade to Silver</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
