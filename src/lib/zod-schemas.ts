import { z } from 'zod';

export const biodataSchema = z.object({
  // Personal Details
  fullName: z.string().min(1, "Full name is required"),
  dob: z.string().min(1, "Date of Birth is required"),
  height: z.string().optional(),
  religion: z.string().optional(),
  caste: z.string().optional(),
  motherTongue: z.string().optional(),
  maritalStatus: z.string().optional(),
  photo: z.string().optional(), // Base64 string for photo

  // AI Generated Intro
  introduction: z.string().optional(),

  // Family Details
  fatherName: z.string().optional(),
  fatherOccupation: z.string().optional(),
  motherName: z.string().optional(),
  motherOccupation: z.string().optional(),
  siblings: z.string().optional(),
  familyValues: z.string().optional(),

  // Education Details
  highestQualification: z.string().optional(),
  collegeName: z.string().optional(),
  graduationYear: z.string().optional(),

  // Professional Details
  occupation: z.string().optional(),
  companyName: z.string().optional(),
  annualIncome: z.string().optional(),

  // Lifestyle Details
  diet: z.string().optional(),
  hobbies: z.string().optional(),
  interests: z.string().optional(),

  // Contact Details
  phone: z.string().optional(),
  email: z.string().email({ message: "Invalid email address" }).optional().or(z.literal('')),
  address: z.string().optional(),

  // Layout choice
  layout: z.enum(['modern', 'traditional']).default('modern'),
});

export type BiodataFormValues = z.infer<typeof biodataSchema>;

export const defaultBiodataValues: BiodataFormValues = {
  fullName: '',
  dob: '',
  height: '',
  religion: '',
  caste: '',
  motherTongue: '',
  maritalStatus: '',
  photo: '',
  introduction: '',
  fatherName: '',
  fatherOccupation: '',
  motherName: '',
  motherOccupation: '',
  siblings: '',
  familyValues: '',
  highestQualification: '',
  collegeName: '',
  graduationYear: '',
  occupation: '',
  companyName: '',
  annualIncome: '',
  diet: '',
  hobbies: '',
  interests: '',
  phone: '',
  email: '',
  address: '',
  layout: 'modern',
};
