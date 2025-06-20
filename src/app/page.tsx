"use client";

import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { biodataSchema, type BiodataFormValues, defaultBiodataValues } from '@/lib/zod-schemas';

import AppHeader from '@/components/shaadicraft/AppHeader';
import BiodataForm from '@/components/shaadicraft/BiodataForm';
import BiodataPreview from '@/components/shaadicraft/BiodataPreview';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ShaadiCraftPage() {
  const form = useForm<BiodataFormValues>({
    resolver: zodResolver(biodataSchema),
    defaultValues: defaultBiodataValues,
    mode: 'onChange', // Useful for real-time preview
  });

  const watchedValues = form.watch();
  const { formState: { isDirty } } = form;


  const handleDownloadPdf = useCallback(() => {
    // Timeout to ensure styles are applied if any state change affects the preview
    setTimeout(() => {
      window.print();
    }, 100);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader form={form} onDownloadPdf={handleDownloadPdf} />
      <main className="flex-grow container mx-auto py-4 px-2 md:px-0">
        <div className="flex flex-col lg:flex-row lg:space-x-6 h-full">
          {/* Form Section */}
          <ScrollArea className="w-full lg:w-1/2 h-auto lg:max-h-[calc(100vh-150px)] no-print mb-6 lg:mb-0">
            <div className="p-1 md:p-4 rounded-lg">
              <BiodataForm form={form} />
            </div>
          </ScrollArea>

          {/* Preview Section */}
          <ScrollArea className="w-full lg:w-1/2 h-auto lg:max-h-[calc(100vh-150px)]">
             <div className="p-1 md:p-4 rounded-lg" id="biodata-preview-container"> {/* Ensure this ID is unique if others exist */}
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
