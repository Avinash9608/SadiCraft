"use client";

import type { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { BiodataFormValues } from '@/lib/zod-schemas';

interface ProfessionalDetailsFormProps {
  form: UseFormReturn<BiodataFormValues>;
}

const ProfessionalDetailsForm: React.FC<ProfessionalDetailsFormProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="occupation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Occupation / Profession</FormLabel>
            <FormControl>
              <Input placeholder="E.g., Software Engineer, Doctor, Teacher" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="companyName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Name / Organization</FormLabel>
            <FormControl>
              <Input placeholder="E.g., Google, Tata Consultancy Services, Self-employed" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="annualIncome"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Annual Income (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="E.g., 12 LPA, USD 80,000" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       {/* Optionally, add a Textarea for more details about profession if needed */}
      {/*
      <FormField
        control={form.control}
        name="professionalExtraDetails" // Add this to schema if used
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Professional Details (Optional)</FormLabel>
            <FormControl>
              <Textarea placeholder="Describe your role, responsibilities, or career aspirations." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      */}
    </div>
  );
};

export default ProfessionalDetailsForm;
