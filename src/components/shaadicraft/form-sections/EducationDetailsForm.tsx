"use client";

import type { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { BiodataFormValues } from '@/lib/zod-schemas';

interface EducationDetailsFormProps {
  form: UseFormReturn<BiodataFormValues>;
}

const EducationDetailsForm: React.FC<EducationDetailsFormProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="highestQualification"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Highest Qualification</FormLabel>
            <FormControl>
              <Input placeholder="E.g., MBA, B.Tech, M.Sc" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="collegeName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>College/University Name</FormLabel>
            <FormControl>
              <Input placeholder="E.g., University of Delhi, IIT Bombay" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="graduationYear"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Year of Graduation/Completion</FormLabel>
            <FormControl>
              <Input type="text" placeholder="E.g., 2020" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* Optionally, add a Textarea for more details about education if needed */}
      {/* 
      <FormField
        control={form.control}
        name="educationExtraDetails" // Add this to schema if used
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Educational Details (Optional)</FormLabel>
            <FormControl>
              <Textarea placeholder="Mention any certifications, specializations, or academic achievements." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      */}
    </div>
  );
};

export default EducationDetailsForm;
