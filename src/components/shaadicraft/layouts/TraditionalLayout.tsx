import React from 'react';
import Image from 'next/image';
import type { BiodataFormValues } from '@/lib/zod-schemas';
import { Separator } from '@/components/ui/separator';

interface TraditionalLayoutProps {
  data: BiodataFormValues;
}

const DetailRow: React.FC<{ label: string; value?: string; fullWidth?: boolean }> = ({ label, value, fullWidth }) => {
  if (!value) return null;
  return (
    <div className={`py-2 ${fullWidth ? 'col-span-2' : ''}`}>
      <span className="font-semibold text-foreground pr-2">{label}:</span>
      <span className="text-muted-foreground whitespace-pre-wrap">{value}</span>
    </div>
  );
};

const SectionBlock: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-6">
    <h2 className="text-xl font-bold text-primary mb-2 pb-1 border-b-2 border-primary">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">{children}</div>
  </section>
);


const TraditionalLayout: React.FC<TraditionalLayoutProps> = ({ data }) => {
  return (
    <div id="biodata-preview-content" className="p-6 md:p-8 bg-background border border-border rounded-lg shadow-lg font-body">
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold font-headline text-primary mb-2">।। बायोडाटा ।।</h1>
        {/* <h1 className="text-4xl font-bold font-headline text-primary mb-2">Biodata</h1> */}
      </header>
      
      <div className="flex flex-col md:flex-row gap-6">
        {data.photo && (
          <div className="w-full md:w-1/3 flex justify-center md:justify-start">
            <div className="w-40 h-48 md:w-48 md:h-60 rounded border-2 border-primary p-1 shadow-md">
              <div className="relative w-full h-full">
                <Image src={data.photo} alt={data.fullName || 'Profile Photo'} layout="fill" objectFit="cover" data-ai-hint="profile photo"/>
              </div>
            </div>
          </div>
        )}
        <div className={`w-full ${data.photo ? 'md:w-2/3' : 'md:w-full'}`}>
          {data.introduction && (
            <section className="mb-4">
               <h2 className="text-xl font-bold text-primary mb-2 pb-1 border-b-2 border-primary">Introduction</h2>
              <p className="text-base leading-relaxed whitespace-pre-wrap text-muted-foreground">{data.introduction}</p>
            </section>
          )}
        </div>
      </div>

      <Separator className="my-6" />

      <SectionBlock title="Personal Details">
        <DetailRow label="Full Name" value={data.fullName} />
        <DetailRow label="Date of Birth" value={data.dob} />
        <DetailRow label="Height" value={data.height} />
        <DetailRow label="Marital Status" value={data.maritalStatus} />
        <DetailRow label="Religion" value={data.religion} />
        <DetailRow label="Caste / Community" value={data.caste} />
        <DetailRow label="Mother Tongue" value={data.motherTongue} />
      </SectionBlock>

      <SectionBlock title="Family Background">
        <DetailRow label="Father's Name" value={data.fatherName} />
        <DetailRow label="Father's Occupation" value={data.fatherOccupation} />
        <DetailRow label="Mother's Name" value={data.motherName} />
        <DetailRow label="Mother's Occupation" value={data.motherOccupation} />
        <DetailRow label="Siblings" value={data.siblings} fullWidth />
        <DetailRow label="Family Values" value={data.familyValues} fullWidth />
      </SectionBlock>

      <SectionBlock title="Educational Background">
        <DetailRow label="Highest Qualification" value={data.highestQualification} />
        <DetailRow label="College/University" value={data.collegeName} />
        <DetailRow label="Year of Completion" value={data.graduationYear} />
      </SectionBlock>

      <SectionBlock title="Professional Details">
        <DetailRow label="Occupation" value={data.occupation} />
        <DetailRow label="Company / Organization" value={data.companyName} />
        <DetailRow label="Annual Income" value={data.annualIncome} />
      </SectionBlock>

      <SectionBlock title="Lifestyle">
        <DetailRow label="Dietary Preferences" value={data.diet} />
        <DetailRow label="Hobbies" value={data.hobbies} fullWidth />
        <DetailRow label="Interests" value={data.interests} fullWidth />
      </SectionBlock>
      
      <SectionBlock title="Contact Information">
        <DetailRow label="Phone" value={data.phone} />
        <DetailRow label="Email" value={data.email} />
        <DetailRow label="Address" value={data.address} fullWidth />
      </SectionBlock>

      <footer className="mt-8 pt-4 text-center text-xs text-muted-foreground border-t border-border">
        Generated with ShaadiCraft
      </footer>
    </div>
  );
};

export default TraditionalLayout;
