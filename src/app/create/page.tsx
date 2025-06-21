
"use client";

import React, { useCallback, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';

import { biodataSchema, type BiodataFormValues, defaultBiodataValues } from '@/lib/zod-schemas';
import { AuthContext } from '@/lib/AuthContext';
import { Spinner } from '@/components/Spinner';

import AppHeader from '@/components/shaadicraft/AppHeader';
import BiodataForm from '@/components/shaadicraft/BiodataForm';
import BiodataPreview from '@/components/shaadicraft/BiodataPreview';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from "@/hooks/use-toast";

export default function ShaadiCraftPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authContext = useContext(AuthContext);

  const form = useForm<BiodataFormValues>({
    resolver: zodResolver(biodataSchema),
    defaultValues: defaultBiodataValues,
    mode: 'onChange', 
  });

  const watchedValues = form.watch();
  const { formState: { isDirty } } = form;
  const { toast } = useToast();

  const handleDownloadPdf = useCallback(async () => {
    if (typeof window !== 'undefined') {
      const html2pdf = (await import('html2pdf.js')).default;

      const element = document.getElementById('biodata-preview-content');
      const currentData = form.getValues();

      if (element && html2pdf) {
        const filename = currentData.fullName
          ? `${currentData.fullName.replace(/\s+/g, '_')}_Biodata.pdf`
          : 'biodata.pdf';

        const opt = {
          margin:       0.5,
          filename:     filename,
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2, useCORS: true, logging: false, letterRendering: true },
          jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().from(element).set(opt).save()
          .catch((err: Error) => {
            console.error("Error generating PDF:", err);
            toast({
              variant: "destructive",
              title: "PDF Generation Failed",
              description: "There was an error generating the PDF. Please try again.",
            });
          });
      } else {
        if (!element) {
          console.error("Biodata preview element not found for PDF generation.");
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not generate PDF. Preview element is missing.",
          });
        }
        if (!html2pdf) {
          console.error("html2pdf library not loaded.");
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not generate PDF. PDF library failed to load.",
          });
        }
      }
    }
  }, [form, toast]);
  
  useEffect(() => {
    if (authContext && !authContext.loading && !authContext.user) {
      router.push('/login');
    }
  }, [authContext, router]);

  // Set layout from URL parameter on initial load
  useEffect(() => {
    const layoutParam = searchParams.get('layout');
    if (layoutParam === 'modern' || layoutParam === 'traditional') {
      form.setValue('layout', layoutParam, { shouldDirty: true });
      // Clean the URL so a refresh doesn't re-apply the layout
      const newUrl = window.location.pathname;
      window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on component mount

  // Auth Guard: Show spinner while loading or if user is not logged in (and redirect is pending)
  if (authContext?.loading || !authContext?.user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader form={form} onDownloadPdf={handleDownloadPdf} />
      <main className="flex-grow container mx-auto py-4 px-2 md:px-0">
        <div className="flex flex-col lg:flex-row lg:space-x-6 h-full">
          {/* Form Section */}
          <ScrollArea className="w-full lg:w-1/2 h-auto lg:max-h-[calc(100vh-150px)] no-print mb-6 lg:mb-0">
            <div className="p-1 md:p-4 rounded-lg">
              {/* Ad Placeholder - Shown only to Free users */}
              {!authContext.isPremium && (
                 <div className="mb-6">
                  <div className="w-[300px] h-[250px] mx-auto bg-muted/50 flex items-center justify-center border border-dashed rounded-lg">
                    <p className="text-muted-foreground text-center">Advertisement<br/>(300x250)</p>
                  </div>
                </div>
              )}
              <BiodataForm form={form} />
            </div>
          </ScrollArea>

          {/* Preview Section */}
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
  );
}
