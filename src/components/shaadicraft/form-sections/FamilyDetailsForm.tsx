"use client";

import type { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
                <Input placeholder="E.g., Shree Suresh Sharma" {...field} />
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
                <Input placeholder="E.g., Farmer and small business owner" {...field} />
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
                <Input placeholder="E.g., Smt. Anita Sharma" {...field} />
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
                <Input placeholder="E.g., Homemaker" {...field} />
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
              <Textarea placeholder="E.g., 1 Younger Brother (Software Engineer, Unmarried)" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="familyType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Family Type</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select family type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Nuclear">Nuclear</SelectItem>
                  <SelectItem value="Joint">Joint</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
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
                <Input placeholder="E.g., Moderate, Traditional, Liberal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="familyLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Family Location</FormLabel>
              <FormControl>
                <Input placeholder="E.g., Patna, Bihar" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nativePlace"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Native Place</FormLabel>
              <FormControl>
                <Input placeholder="E.g., Patna, Bihar" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default FamilyDetailsForm;
