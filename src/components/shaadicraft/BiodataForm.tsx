"use client";

import React, { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod'; // Not needed directly here if passed in page
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Users, GraduationCap, Briefcase, Heart, Phone, Sparkles } from 'lucide-react';

import PersonalDetailsForm from './form-sections/PersonalDetailsForm';
import FamilyDetailsForm from './form-sections/FamilyDetailsForm';
import EducationDetailsForm from './form-sections/EducationDetailsForm';
import ProfessionalDetailsForm from './form-sections/ProfessionalDetailsForm';
import LifestyleDetailsForm from './form-sections/LifestyleDetailsForm';
import ContactDetailsForm from './form-sections/ContactDetailsForm';
import SectionTitle from './SectionTitle';
import { Spinner } from '@/components/Spinner';

import type { BiodataFormValues } from '@/lib/zod-schemas';
import { generateIntro, type GenerateIntroInput } from '@/ai/flows/generate-intro';
import { useToast } from "@/hooks/use-toast";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';


interface BiodataFormProps {
  form: UseFormReturn<BiodataFormValues>;
}

const BiodataForm: React.FC<BiodataFormProps> = ({ form }) => {
  const [isGeneratingIntro, setIsGeneratingIntro] = useState(false);
  const { toast } = useToast();

  const prepareAiInput = (formData: BiodataFormValues): GenerateIntroInput => {
    return {
      personalDetails: `Name: ${formData.fullName}, Age: ${formData.age}, DOB: ${formData.dob}, Height: ${formData.height || 'N/A'}, Gender: ${formData.gender || 'N/A'}, Complexion: ${formData.complexion || 'N/A'}, Religion: ${formData.religion || 'N/A'}, Caste: ${formData.caste || 'N/A'}, Sub-caste: ${formData.subCaste || 'N/A'}, Mother Tongue: ${formData.motherTongue || 'N/A'}, Marital Status: ${formData.maritalStatus || 'N/A'}, Manglik Status: ${formData.manglikStatus || 'N/A'}.`,
      familyDetails: `Father: ${formData.fatherName || 'N/A'} (${formData.fatherOccupation || 'N/A'}), Mother: ${formData.motherName || 'N/A'} (${formData.motherOccupation || 'N/A'}), Siblings: ${formData.siblings || 'N/A'}, Family Type: ${formData.familyType || 'N/A'}, Family Values: ${formData.familyValues || 'N/A'}, Family Location: ${formData.familyLocation || 'N/A'}, Native Place: ${formData.nativePlace || 'N/A'}.`,
      educationDetails: `Highest Qualification: ${formData.highestQualification || 'N/A'}, College: ${formData.collegeName || 'N/A'}, Year: ${formData.graduationYear || 'N/A'}.`,
      professionalDetails: `Occupation: ${formData.occupation || 'N/A'}, Company: ${formData.companyName || 'N/A'}, Role: ${formData.role || 'N/A'}, Work Mode: ${formData.workMode || 'N/A'}, Income: ${formData.annualIncome || 'N/A'}.`,
      lifestyleDetails: `Diet: ${formData.diet || 'N/A'}, Smoking: ${formData.smoking || 'N/A'}, Drinking: ${formData.drinking || 'N/A'}, Hobbies: ${formData.hobbies || 'N/A'}, Interests: ${formData.interests || 'N/A'}, Languages Known: ${formData.languagesKnown || 'N/A'}.`,
      contactDetails: `Phone: ${formData.phone || 'N/A'}, Email: ${formData.email || 'N/A'}, Address: ${formData.address || 'N/A'}, Contact Person: ${formData.contactPerson || 'N/A'}.`,
      layoutChoice: formData.layout,
    };
  };

  const handleGenerateIntro = async () => {
    setIsGeneratingIntro(true);
    try {
      const formData = form.getValues();
      const aiInput = prepareAiInput(formData);
      const result = await generateIntro(aiInput);
      if (result.introduction) {
        form.setValue('introduction', result.introduction, { shouldValidate: true, shouldDirty: true });
        toast({ title: "Introduction Generated", description: "AI-powered introduction has been added." });
      } else {
        throw new Error("AI did not return an introduction.");
      }
    } catch (error) {
      console.error("Error generating introduction:", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to generate introduction. Please try again." });
    } finally {
      setIsGeneratingIntro(false);
    }
  };
  
  const tabItems = [
    { value: "personal", label: "Personal", icon: User, component: <PersonalDetailsForm form={form} /> },
    { value: "family", label: "Family", icon: Users, component: <FamilyDetailsForm form={form} /> },
    { value: "education", label: "Education", icon: GraduationCap, component: <EducationDetailsForm form={form} /> },
    { value: "professional", label: "Professional", icon: Briefcase, component: <ProfessionalDetailsForm form={form} /> },
    { value: "lifestyle", label: "Lifestyle", icon: Heart, component: <LifestyleDetailsForm form={form} /> },
    { value: "contact", label: "Contact", icon: Phone, component: <ContactDetailsForm form={form} /> },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})} className="space-y-8">
        <Card>
          <CardHeader>
            <SectionTitle
              title="Craft Your Biodata"
              icon={Sparkles}
            />
            <CardDescription>
              Fill in the details below. Your biodata will update in real-time in the preview panel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="introduction"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <FormLabel className="text-lg font-semibold">Introduction (AI Generated)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Click 'Generate with AI' to create an introduction, or write your own."
                      {...field}
                      rows={5}
                      className="mt-1"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="button" onClick={handleGenerateIntro} disabled={isGeneratingIntro} className="w-full md:w-auto">
              {isGeneratingIntro ? <Spinner className="mr-2 h-4 w-4" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Generate Introduction with AI
            </Button>
            <p className="text-xs text-muted-foreground mt-2">Ensure other sections are filled for best results.</p>
          </CardContent>
        </Card>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-6">
            {tabItems.map(item => (
              <TabsTrigger key={item.value} value={item.value} className="text-xs sm:text-sm">
                <item.icon className="mr-1.5 h-4 w-4 hidden sm:inline-block" />
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabItems.map(item => (
            <TabsContent key={item.value} value={item.value}>
              <Card>
                <CardHeader>
                  <SectionTitle title={`${item.label} Details`} icon={item.icon} />
                </CardHeader>
                <CardContent>
                  {item.component}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </form>
    </Form>
  );
};

export default BiodataForm;
