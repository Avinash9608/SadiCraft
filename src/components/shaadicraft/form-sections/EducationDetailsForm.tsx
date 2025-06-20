"use client";

import type { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea'; // If more details needed
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
            <FormLabel>Degree / Highest Qualification</FormLabel>
            <FormControl>
              <Input placeholder="E.g., B.Tech in Computer Science & Engineering" {...field} />
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
            <FormLabel>College/University Name (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="E.g., Indian Institute of Technology, Delhi" {...field} />
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
            <FormLabel>Year of Graduation/Completion (Optional)</FormLabel>
            <FormControl>
              <Input type="text" placeholder="E.g., 2024" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default EducationDetailsForm;
