"use client";

import type { UseFormReturn } from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FormField, FormItem, FormControl } from '@/components/ui/form';
import type { BiodataFormValues } from '@/lib/zod-schemas';

interface LayoutSelectorProps {
  form: UseFormReturn<BiodataFormValues>;
}

const LayoutSelector: React.FC<LayoutSelectorProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="layout"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <Label className="text-base">Select Layout Style</Label>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex items-center space-x-4"
            >
              <FormItem className="flex items-center space-x-2 space-y-0">
                <FormControl>
                  <RadioGroupItem value="modern" id="modern-layout" />
                </FormControl>
                <Label htmlFor="modern-layout" className="font-normal cursor-pointer">
                  Modern
                </Label>
              </FormItem>
              <FormItem className="flex items-center space-x-2 space-y-0">
                <FormControl>
                  <RadioGroupItem value="traditional" id="traditional-layout" />
                </FormControl>
                <Label htmlFor="traditional-layout" className="font-normal cursor-pointer">
                  Traditional
                </Label>
              </FormItem>
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default LayoutSelector;
