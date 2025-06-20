"use client";

import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import LayoutSelector from './LayoutSelector';
import { Download, FileText } from 'lucide-react';
import type { BiodataFormValues } from '@/lib/zod-schemas';
import { Form } from '@/components/ui/form'; // Import FormProvider

interface AppHeaderProps {
  form: UseFormReturn<BiodataFormValues>;
  onDownloadPdf: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ form, onDownloadPdf }) => {
  return (
    <header className="py-6 px-4 md:px-8 bg-card border-b border-border shadow-sm no-print">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center">
           <FileText className="h-8 w-8 text-primary mr-2" />
          <h1 className="text-3xl font-headline font-bold text-primary">ShaadiCraft</h1>
        </div>
        <Form {...form}> {/* Wrap the section that needs form context */}
          <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
            <LayoutSelector form={form} /> {/* Now LayoutSelector is within FormProvider context */}
            <Button onClick={onDownloadPdf} variant="outline" className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </Form>
      </div>
    </header>
  );
};

export default AppHeader;