"use client";

import type { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { BiodataFormValues } from '@/lib/zod-schemas';

interface ContactDetailsFormProps {
  form: UseFormReturn<BiodataFormValues>;
}

const ContactDetailsForm: React.FC<ContactDetailsFormProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number (Optional)</FormLabel>
            <FormControl>
              <Input type="tel" placeholder="E.g., +91 XXXXXXXXXX" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email Address (Optional)</FormLabel>
            <FormControl>
              <Input type="email" placeholder="E.g., user@example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Current Address (Optional)</FormLabel>
            <FormControl>
              <Textarea placeholder="E.g., City, State, Country. Be mindful of privacy." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ContactDetailsForm;
