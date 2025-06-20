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
    .describe('Personal details: Name, Age, DOB, Height, Gender, Complexion, Religion, Caste, Sub-caste, Mother Tongue, Marital Status, Manglik Status.'),
  familyDetails: z
    .string()
    .describe("Family background: Father's name & occupation, Mother's name & occupation, Siblings details, Family type, Family values, Family location, Native place."),
  educationDetails: z.string().describe('Educational qualifications: Highest Qualification, College, Year of completion.'),
  professionalDetails: z.string().describe('Professional career details: Occupation, Company, Role, Work Mode, Income.'),
  lifestyleDetails: z
    .string()
    .describe('Lifestyle preferences: Diet, Smoking, Drinking, Hobbies, Interests, Languages Known.'),
  contactDetails: z.string().describe('Contact information: Phone, Email, Address, Contact Person.'), // Contact details are less likely for an intro, but included for completeness.
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
  description: 'Analyzes comprehensive biodata information to identify key highlights and distinguishing factors suitable for an engaging introductory paragraph. Focus on unique positive attributes.',
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
  // This is a placeholder. A real implementation might involve another LLM call or specific logic.
  // For now, it concatenates some key info.
  let highlights = [];
  if (input.personalDetails) highlights.push(`Personal traits: ${input.personalDetails.substring(0,100)}...`);
  if (input.professionalDetails) highlights.push(`Professional standing: ${input.professionalDetails.substring(0,100)}...`);
  if (input.educationDetails) highlights.push(`Educational background: ${input.educationDetails.substring(0,70)}...`);
  if (input.familyDetails) highlights.push(`Family context: ${input.familyDetails.substring(0,70)}...`);
  return `Key highlights from biodata: ${highlights.join('; ')}. Focus on positive and unique aspects.`;
});

const prompt = ai.definePrompt({
  name: 'generateIntroPrompt',
  input: {schema: GenerateIntroInputSchema},
  output: {schema: GenerateIntroOutputSchema},
  tools: [biodataAnalyzerTool],
  system: `You are an expert marriage biodata writer specializing in crafting warm, positive, and engaging introductory paragraphs.
The introduction should be a brief overview, setting a positive tone.
Use the 'biodataAnalyzer' tool to extract the most relevant and impressive highlights from the provided details.
Tailor the tone and style of the introduction based on the 'layoutChoice':
- For 'modern' layout: Use a slightly contemporary, direct, and confident tone.
- For 'traditional' layout: Use a more respectful, slightly formal, and warm tone.
The introduction should be about 3-5 sentences long. Avoid simply listing all details. Weave the highlights into a narrative.
Focus on presenting the individual in the best possible light for a matrimonial context.
Example for modern: "Meet [Name], a [Age]-year-old [Profession] based in [City]. With a strong educational background in [Field] and a passion for [Interest], [he/she] is looking for a like-minded partner..."
Example for traditional: "We are pleased to introduce [Name], a [Age]-year-old individual from a respected family in [City]. [He/She] has completed [Qualification] and is currently working as a [Profession]..."
`,
  prompt: `Generate an introductory paragraph using the insights from the biodataAnalyzerTool.
Biodata Summary (for context, tool provides detailed analysis):
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
  async input => {
    const {output} = await prompt(input);
    if (!output?.introduction) {
        // Fallback or error handling if AI fails to generate intro
        return { introduction: "We are pleased to present this biodata for your kind consideration. Please review the detailed sections for more information." };
    }
    return output;
  }
);
