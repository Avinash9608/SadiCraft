"use client";

import type { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { BiodataFormValues } from '@/lib/zod-schemas';

interface LifestyleDetailsFormProps {
  form: UseFormReturn<BiodataFormValues>;
}

const LifestyleDetailsForm: React.FC<LifestyleDetailsFormProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="diet"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dietary Preferences</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select diet" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                <SelectItem value="Non-Vegetarian">Non-Vegetarian</SelectItem>
                <SelectItem value="Eggetarian">Eggetarian</SelectItem>
                <SelectItem value="Jain">Jain</SelectItem>
                <SelectItem value="Vegan">Vegan</SelectItem>
                <SelectItem value="Other">Other (Specify if needed)</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="hobbies"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hobbies</FormLabel>
            <FormControl>
              <Input placeholder="E.g., Reading, Traveling, Cooking" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="interests"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Interests</FormLabel>
            <FormControl>
              <Textarea placeholder="E.g., Technology, Music, Sports, Social Work" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default LifestyleDetailsForm;
