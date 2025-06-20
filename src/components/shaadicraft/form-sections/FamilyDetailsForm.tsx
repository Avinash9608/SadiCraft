"use client";

import type { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { BiodataFormValues } from '@/lib/zod-schemas';

interface FamilyDetailsFormProps {
  form: UseFormReturn<BiodataFormValues>;
}

const FamilyDetailsForm: React.FC<FamilyDetailsFormProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="fatherName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Father's Name</FormLabel>
              <FormControl>
                <Input placeholder="E.g., Suresh Sharma" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fatherOccupation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Father's Occupation</FormLabel>
              <FormControl>
                <Input placeholder="E.g., Businessman, Teacher" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="motherName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mother's Name</FormLabel>
              <FormControl>
                <Input placeholder="E.g., Anita Sharma" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="motherOccupation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mother's Occupation</FormLabel>
              <FormControl>
                <Input placeholder="E.g., Homemaker, Doctor" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="siblings"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Siblings Details</FormLabel>
            <FormControl>
              <Textarea placeholder="E.g., 1 elder brother (married, settled in USA), 1 younger sister (studying)" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="familyValues"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Family Values</FormLabel>
            <FormControl>
              <Textarea placeholder="E.g., Moderate, Traditional, Liberal" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default FamilyDetailsForm;
