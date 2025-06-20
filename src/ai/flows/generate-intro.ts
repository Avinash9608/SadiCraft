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
    .describe('Personal details of the individual (name, age, etc.)'),
  familyDetails: z.string().describe('Family background information.'),
  educationDetails: z.string().describe('Educational qualifications.'),
  professionalDetails: z.string().describe('Professional career details.'),
  lifestyleDetails: z.string().describe('Lifestyle preferences and habits.'),
  contactDetails: z.string().describe('Contact information.'),
  layoutChoice: z
    .enum(['modern', 'traditional'])
    .describe('The layout style chosen for the biodata.'),
});
export type GenerateIntroInput = z.infer<typeof GenerateIntroInputSchema>;

const GenerateIntroOutputSchema = z.object({
  introduction: z
    .string()
    .describe('A personalized introductory paragraph for the biodata.'),
});
export type GenerateIntroOutput = z.infer<typeof GenerateIntroOutputSchema>;

export async function generateIntro(input: GenerateIntroInput): Promise<GenerateIntroOutput> {
  return generateIntroFlow(input);
}

const biodataAnalyzer = ai.defineTool({
  name: 'biodataAnalyzer',
  description: 'Analyzes biodata information to identify key highlights for an engaging introduction.',
  inputSchema: z.object({
    personalDetails: z
      .string()
      .describe('Personal details of the individual (name, age, etc.)'),
    familyDetails: z.string().describe('Family background information.'),
    educationDetails: z.string().describe('Educational qualifications.'),
    professionalDetails: z.string().describe('Professional career details.'),
    lifestyleDetails: z.string().describe('Lifestyle preferences and habits.'),
  }),
  outputSchema: z.string().describe('A summary of the most important aspects of the biodata.'),
},
async (input) => {
  // In a real implementation, this tool would analyze the biodata details
  // using a more sophisticated method, potentially involving its own LLM call.
  // This is a placeholder implementation.
  return `Key aspects: ${input.personalDetails}, ${input.familyDetails}`;
});

const prompt = ai.definePrompt({
  name: 'generateIntroPrompt',
  input: {schema: GenerateIntroInputSchema},
  output: {schema: GenerateIntroOutputSchema},
  tools: [biodataAnalyzer],
  system: `You are a professional biodata writer. Generate a concise and engaging introductory paragraph based on the key aspects of the biodata.

  The intro should be tailored to the specified layout choice.
  Use the biodataAnalyzer tool to understand the highlights of the biodata.
  Write in a tone appropriate for the layoutChoice: {{{layoutChoice}}}.`,
  prompt: `Biodata Details:
  Personal: {{{personalDetails}}}
  Family: {{{familyDetails}}}
  Education: {{{educationDetails}}}
  Professional: {{{professionalDetails}}}
  Lifestyle: {{{lifestyleDetails}}}
  Contact: {{{contactDetails}}}

  Introductory Paragraph:`, // The actual prompt instruction
});

const generateIntroFlow = ai.defineFlow(
  {
    name: 'generateIntroFlow',
    inputSchema: GenerateIntroInputSchema,
    outputSchema: GenerateIntroOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
