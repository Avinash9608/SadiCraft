"use client";

import type { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Textarea } from '@/components/ui/textarea'; // If more details needed
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
              <Input placeholder="E.g., Software Engineer" {...field} />
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
              <Input placeholder="E.g., IndTechmark, Govt. Sector" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Role / Designation (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="E.g., Backend Developer, Manager" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="workMode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Work Mode (Optional)</FormLabel>
             <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select work mode" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Work From Home">Work From Home (WFH)</SelectItem>
                  <SelectItem value="Work From Office">Work From Office</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
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
    </div>
  );
};

export default ProfessionalDetailsForm;
