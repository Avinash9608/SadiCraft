"use client";

import Image from 'next/image';
import React, { useState, useCallback } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, X } from 'lucide-react';
import type { BiodataFormValues } from '@/lib/zod-schemas';

interface PhotoUploadProps {
  form: UseFormReturn<BiodataFormValues>;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ form }) => {
  const [preview, setPreview] = useState<string | null>(form.getValues('photo') || null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        form.setValue('photo', base64String, { shouldValidate: true, shouldDirty: true });
      };
      reader.readAsDataURL(file);
    }
  }, [form]);

  const removePhoto = useCallback(() => {
    setPreview(null);
    form.setValue('photo', '', { shouldValidate: true, shouldDirty: true });
    const fileInput = document.getElementById('photo-upload-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // Reset file input
    }
  }, [form]);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg">Profile Photo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center space-y-4">
          {preview ? (
            <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-border shadow-sm">
              <Image src={preview} alt="Photo preview" layout="fill" objectFit="cover" />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 z-10"
                onClick={removePhoto}
                aria-label="Remove photo"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="w-48 h-48 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center bg-muted/50 text-muted-foreground">
              <UploadCloud className="h-12 w-12 mb-2" />
              <p className="text-sm">No photo selected</p>
            </div>
          )}
        </div>
        <div>
          <Label htmlFor="photo-upload-input" className="sr-only">Upload Photo</Label>
          <Input
            id="photo-upload-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
           <p className="text-xs text-muted-foreground mt-1">Upload a clear, recent photo.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhotoUpload;
