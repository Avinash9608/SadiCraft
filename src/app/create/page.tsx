
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
  const { formState: { isDirty }, reset, setValue } = form;
  const { toast } = useToast();

  const triggerPdfDownload = useCallback(async () => {
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
      }
    }
  }, [form, toast]);

  const handleDownloadPdf = useCallback(async () => {
    if (!authContext) return;

    const isPremium = authContext.isPremium;
    const layout = form.getValues('layout');
    
    // Premium users can download anything for free
    if (isPremium) {
      triggerPdfDownload();
      return;
    }

    // Check for one-time payments if not premium
    const modernDownloadUnlocked = sessionStorage.getItem('modern_download_unlocked') === 'true';
    const traditionalUnlocked = sessionStorage.getItem('traditional_unlocked') === 'true';

    if (layout === 'modern') {
      if (modernDownloadUnlocked) {
        triggerPdfDownload();
      } else {
        router.push('/checkout?action=download_modern');
      }
    } else if (layout === 'traditional') {
      if (traditionalUnlocked) {
        triggerPdfDownload();
      } else {
        toast({
          variant: "destructive",
          title: "Upgrade Required",
          description: "Please unlock the traditional layout before downloading.",
        });
        router.push('/checkout?action=unlock_traditional&return_to_layout=traditional');
      }
    }
  }, [authContext, form, router, toast, triggerPdfDownload]);


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
    if (isDirty) {
      sessionStorage.setItem('biodataFormData', JSON.stringify(watchedValues));
    }
  }, [watchedValues, isDirty]);
  
  // Auth Guard and redirect logic
  useEffect(() => {
    if (authContext && !authContext.loading && !authContext.user) {
      router.push('/login');
    }
  }, [authContext, router]);

  // Set layout from URL parameter on initial load
  useEffect(() => {
    const layoutParam = searchParams.get('layout');
    if (layoutParam === 'modern' || layoutParam === 'traditional') {
      setValue('layout', layoutParam, { shouldDirty: true });
      const newUrl = window.location.pathname;
      window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
    }
  }, [searchParams, setValue]); 

  // Effect to handle post-payment download for modern layout
  useEffect(() => {
    const modernDownloadUnlocked = sessionStorage.getItem('modern_download_unlocked') === 'true';
    if (modernDownloadUnlocked) {
      sessionStorage.removeItem('modern_download_unlocked'); // Use the unlock flag once
      triggerPdfDownload();
    }
  }, [triggerPdfDownload]);

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
          <ScrollArea className="w-full lg:w-1/2 h-auto lg:max-h-[calc(100vh-150px)] no-print mb-6 lg:mb-0">
            <div className="p-1 md:p-4 rounded-lg">
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
