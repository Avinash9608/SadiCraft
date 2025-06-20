
'use server';

/**
 * @fileOverview Generates an introductory paragraph for a biodata using AI.
 *
 * - generateIntro - A function that generates the introduction.
 * - GenerateIntroInput - The input type for the generateIntro function.
 * - GenerateIntroOutput - The return type for the generateIntro function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateIntroInputSchema = z.object({
  personalDetails: z
    .string()
    .describe('Personal details: Name, Age, DOB, Height, Gender, Complexion, Religion, Caste, Sub-caste, Mother Tongue, Marital Status, Manglik Status, Blood Group.'),
  familyDetails: z
    .string()
    .describe("Family background: Father's name & occupation, Mother's name & occupation, Siblings details, Family type, Family values, Family location, Native place."),
  educationDetails: z.string().describe('Educational qualifications: Highest Qualification, College, Year of completion.'),
  professionalDetails: z.string().describe('Professional career details: Occupation, Company, Role, Work Mode, Income.'),
  lifestyleDetails: z
    .string()
    .describe('Lifestyle preferences: Diet, Smoking, Drinking, Hobbies, Interests, Languages Known.'),
  contactDetails: z.string().describe('Contact information: Phone, Email, Address, Contact Person.'),
  layoutChoice: z
    .enum(['modern', 'traditional'])
    .describe('The layout style chosen for the biodata (modern or traditional). This should influence the tone of the introduction.'),
});
export type GenerateIntroInput = z.infer<typeof GenerateIntroInputSchema>;

const GenerateIntroOutputSchema = z.object({
  introduction: z
    .string()
    .describe('A personalized, concise, and engaging introductory paragraph for the biodata, tailored to the layout choice.'),
});
export type GenerateIntroOutput = z.infer<typeof GenerateIntroOutputSchema>;

export async function generateIntro(input: GenerateIntroInput): Promise<GenerateIntroOutput> {
  return generateIntroFlow(input);
}

const biodataAnalyzerTool = ai.defineTool({
  name: 'biodataAnalyzer',
  description: 'Analyzes comprehensive biodata information to identify key highlights and distinguishing factors suitable for an engaging introductory paragraph. Focus on unique positive attributes from all provided details.',
  inputSchema: z.object({
    personalDetails: GenerateIntroInputSchema.shape.personalDetails,
    familyDetails: GenerateIntroInputSchema.shape.familyDetails,
    educationDetails: GenerateIntroInputSchema.shape.educationDetails,
    professionalDetails: GenerateIntroInputSchema.shape.professionalDetails,
    lifestyleDetails: GenerateIntroInputSchema.shape.lifestyleDetails,
  }),
  outputSchema: z.string().describe('A concise summary of the most compelling aspects of the biodata to be highlighted in the introduction. For example: "Highly educated (B.Tech CS) and professionally accomplished (Software Engineer at IndTechmark) individual from a moderate, Patna-based family. Enjoys exploring new tech."'),
},
async (input) => {
  let highlights = [];
  // Ensure all fields are strings before calling substring
  const pd = String(input.personalDetails || "");
  const profd = String(input.professionalDetails || "");
  const edud = String(input.educationDetails || "");
  const famd = String(input.familyDetails || "");
  const lifed = String(input.lifestyleDetails || "");

  if (pd) highlights.push(`Personal traits: ${pd.substring(0,100)}...`);
  if (profd) highlights.push(`Professional standing: ${profd.substring(0,100)}...`);
  if (edud) highlights.push(`Educational background: ${edud.substring(0,70)}...`);
  if (famd) highlights.push(`Family context: ${famd.substring(0,70)}...`);
  if (lifed) highlights.push(`Lifestyle aspects: ${lifed.substring(0,70)}...`);
  
  if (highlights.length === 0) {
    return "No specific highlights provided, but seeking a suitable match.";
  }
  return `Key highlights from biodata: ${highlights.join('; ')}. Focus on positive and unique aspects.`;
});

const prompt = ai.definePrompt({
  name: 'generateIntroPrompt',
  input: {schema: GenerateIntroInputSchema},
  output: {schema: GenerateIntroOutputSchema},
  tools: [biodataAnalyzerTool],
  system: `You are an expert marriage biodata writer specializing in crafting warm, positive, and engaging introductory paragraphs.
The introduction should be a brief overview, setting a positive tone.
Use the 'biodataAnalyzer' tool to extract the most relevant and impressive highlights from the provided details (personal, family, education, professional, lifestyle).
Tailor the tone and style of the introduction based on the 'layoutChoice':
- For 'modern' layout: Use a slightly contemporary, direct, and confident tone.
- For 'traditional' layout: Use a more respectful, slightly formal, and warm tone.
The introduction should be about 3-5 sentences long. Avoid simply listing all details. Weave the highlights into a narrative.
Focus on presenting the individual in the best possible light for a matrimonial context.
Example for modern with "Avinash Kumar": "Meet Avinash Kumar, a 22-year-old Software Engineer based in Patna. With a B.Tech in Computer Science and a passion for exploring new tech stacks, he is looking for a like-minded partner..."
Example for traditional with "Avinash Kumar": "We are pleased to introduce Avinash Kumar, a 22-year-old individual from a respected Brahman family in Patna. He has completed his B.Tech in CS and is currently working as a Software Engineer..."
`,
  prompt: `Generate an introductory paragraph using the insights from the biodataAnalyzerTool.
Biodata Details (for context, tool provides detailed analysis):
Personal: {{{personalDetails}}}
Family: {{{familyDetails}}}
Education: {{{educationDetails}}}
Professional: {{{professionalDetails}}}
Lifestyle: {{{lifestyleDetails}}}
Layout Choice: {{{layoutChoice}}}

Craft the introduction:`,
});

const generateIntroFlow = ai.defineFlow(
  {
    name: 'generateIntroFlow',
    inputSchema: GenerateIntroInputSchema,
    outputSchema: GenerateIntroOutputSchema,
  },
  async (input): Promise<GenerateIntroOutput> => {
    try {
      const { output } = await prompt(input);
      if (output?.introduction) {
        return output;
      } else {
        console.warn("AI did not return an introduction, using fallback.");
        return { introduction: "We are pleased to present this biodata for your kind consideration. Please review the detailed sections for more information." };
      }
    } catch (error) {
      console.error("Error in generateIntroFlow during prompt execution:", error);
      return { introduction: "An error occurred while generating the introduction. Please try again or fill it manually." };
    }
  }
);
