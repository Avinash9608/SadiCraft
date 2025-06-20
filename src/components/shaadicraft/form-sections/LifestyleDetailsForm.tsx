"use client";

import type { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { BiodataFormValues } from '@/lib/zod-schemas';
import { Label } from '@/components/ui/label';

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
                <SelectItem value="Non-Vegetarian">Non-Vegetarian</SelectItem>
                <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                <SelectItem value="Eggetarian">Eggetarian</SelectItem>
                <SelectItem value="Jain">Jain</SelectItem>
                <SelectItem value="Vegan">Vegan</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="smoking"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Smoking Habits</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-2"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="No" />
                    </FormControl>
                    <Label className="font-normal">No</Label>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Yes" />
                    </FormControl>
                    <Label className="font-normal">Yes</Label>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Occasionally" />
                    </FormControl>
                    <Label className="font-normal">Occasionally</Label>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="drinking"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Drinking Habits</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-2"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="No" />
                    </FormControl>
                    <Label className="font-normal">No</Label>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Yes" />
                    </FormControl>
                    <Label className="font-normal">Yes</Label>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Occasionally" />
                    </FormControl>
                    <Label className="font-normal">Occasionally</Label>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="hobbies"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hobbies</FormLabel>
            <FormControl>
              <Input placeholder="E.g., Exploring new tech stacks, Reading" {...field} />
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
              <Textarea placeholder="E.g., Working mechanisms of technology, Music, Sports" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="languagesKnown"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Languages Known</FormLabel>
            <FormControl>
              <Input placeholder="E.g., Hindi, English" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default LifestyleDetailsForm;
