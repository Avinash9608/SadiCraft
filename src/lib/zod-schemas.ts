import { z } from 'zod';

export const biodataSchema = z.object({
  // Personal Details
  fullName: z.string().min(1, "Full name is required"),
  dob: z.string().min(1, "Date of Birth is required"),
  age: z.string().optional(), // Can be calculated, but input allows flexibility
  height: z.string().optional(),
  complexion: z.string().optional(),
  bloodGroup: z.string().optional(),
  gender: z.string().optional(),
  religion: z.string().optional(),
  caste: z.string().optional(),
  subCaste: z.string().optional(), // New
  motherTongue: z.string().optional(),
  maritalStatus: z.string().optional(),
  manglikStatus: z.string().optional(), // New (Non-Manglik, Manglik, Anshik Manglik, Don't Know)
  photo: z.string().optional(), // Base64 string for photo

  // AI Generated Intro
  introduction: z.string().optional(),

  // Family Details
  fatherName: z.string().optional(),
  fatherOccupation: z.string().optional(),
  motherName: z.string().optional(),
  motherOccupation: z.string().optional(),
  siblings: z.string().optional(), // E.g., "1 Younger Brother (Software Engineer, Unmarried)"
  familyType: z.string().optional(), // New (Nuclear, Joint)
  familyValues: z.string().optional(),
  familyLocation: z.string().optional(), // New (e.g., Patna, Bihar)
  nativePlace: z.string().optional(), // New (e.g., Patna, Bihar)

  // Education Details
  highestQualification: z.string().optional(), // "Degree / Highest Qualification"
  collegeName: z.string().optional(),
  graduationYear: z.string().optional(),

  // Professional Details
  occupation: z.string().optional(),
  companyName: z.string().optional(),
  role: z.string().optional(), // New (e.g., Backend Developer)
  workMode: z.string().optional(), // New (e.g., Work From Home)
  annualIncome: z.string().optional(),

  // Lifestyle Details
  diet: z.string().optional(),
  smoking: z.string().optional(), // New (Yes/No)
  drinking: z.string().optional(), // New (Yes/No)
  hobbies: z.string().optional(),
  interests: z.string().optional(),
  languagesKnown: z.string().optional(), // New (e.g., Hindi, English)

  // Contact Details
  phone: z.string().optional(),
  email: z.string().email({ message: "Invalid email address" }).optional().or(z.literal('')),
  address: z.string().optional(), // Current address of the individual
  contactPerson: z.string().optional(), // New (e.g., Mr. Manoj Kumar)

  // Layout choice
  layout: z.enum(['modern', 'traditional']).default('modern'),
});

export type BiodataFormValues = z.infer<typeof biodataSchema>;

export const defaultBiodataValues: BiodataFormValues = {
  fullName: '',
  dob: '',
  age: '',
  height: '',
  complexion: '',
  bloodGroup: '',
  gender: '',
  religion: '',
  caste: '',
  subCaste: '',
  motherTongue: '',
  maritalStatus: '',
  manglikStatus: '',
  photo: '',
  introduction: '',
  fatherName: '',
  fatherOccupation: '',
  motherName: '',
  motherOccupation: '',
  siblings: '',
  familyType: '',
  familyValues: '',
  familyLocation: '',
  nativePlace: '',
  highestQualification: '',
  collegeName: '',
  graduationYear: '',
  occupation: '',
  companyName: '',
  role: '',
  workMode: '',
  annualIncome: '',
  diet: '',
  smoking: 'No',
  drinking: 'No',
  hobbies: '',
  interests: '',
  languagesKnown: '',
  phone: '',
  email: '',
  address: '',
  contactPerson: '',
  layout: 'modern',
};
