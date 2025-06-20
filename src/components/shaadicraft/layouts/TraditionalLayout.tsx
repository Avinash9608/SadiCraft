import React from 'react';
import Image from 'next/image';
import type { BiodataFormValues } from '@/lib/zod-schemas';
import { Separator } from '@/components/ui/separator';

interface TraditionalLayoutProps {
  data: BiodataFormValues;
}

const DetailRow: React.FC<{ label: string; value?: string; fullWidth?: boolean }> = ({ label, value, fullWidth }) => {
  if (!value && value !== '0') return null;
  return (
    <div className={`py-2 ${fullWidth ? 'col-span-2' : ''} break-words`}>
      <span className="font-semibold text-foreground pr-2">{label}:</span>
      <span className="text-muted-foreground whitespace-pre-wrap">{value}</span>
    </div>
  );
};

const SectionBlock: React.FC<{ titleSymbol?: string; title: string; children: React.ReactNode }> = ({ titleSymbol, title, children }) => (
  <section className="mb-6">
    <h2 className="text-xl font-bold text-primary mb-3 pb-1 border-b-2 border-primary">
      {titleSymbol && <span className="mr-2">{titleSymbol}</span>}
      {title}
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">{children}</div>
  </section>
);


const TraditionalLayout: React.FC<TraditionalLayoutProps> = ({ data }) => {
  return (
    <div id="biodata-preview-content" className="p-4 md:p-8 bg-background border border-border rounded-lg shadow-lg font-body">
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold font-headline text-primary mb-2">।। बायोडाटा ।।</h1>
      </header>
      
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {data.photo && (
          <div className="w-full md:w-1/3 flex justify-center md:justify-start mb-4 md:mb-0">
            <div className="w-40 h-48 md:w-48 md:h-60 rounded border-2 border-primary p-1 shadow-md bg-white">
              <div className="relative w-full h-full">
                <Image src={data.photo} alt={data.fullName || 'Profile Photo'} layout="fill" objectFit="cover" data-ai-hint="profile portrait"/>
              </div>
            </div>
          </div>
        )}
        <div className={`w-full ${data.photo ? 'md:w-2/3' : 'md:w-full'}`}>
          {data.introduction && (
            <section className="mb-4">
               <h2 className="text-xl font-bold text-primary mb-2 pb-1 border-b-2 border-primary">📝 Introduction</h2>
              <p className="text-base leading-relaxed whitespace-pre-wrap text-muted-foreground">{data.introduction}</p>
            </section>
          )}
        </div>
      </div>

      <Separator className="my-6" />

      <SectionBlock titleSymbol="👤" title="Personal Information">
        <DetailRow label="Full Name" value={data.fullName} />
        <DetailRow label="Date of Birth" value={data.dob} />
        <DetailRow label="Age" value={data.age ? `${data.age} years` : undefined} />
        <DetailRow label="Gender" value={data.gender} />
        <DetailRow label="Height" value={data.height} />
        <DetailRow label="Complexion" value={data.complexion} />
        <DetailRow label="Blood Group" value={data.bloodGroup} />
        <DetailRow label="Marital Status" value={data.maritalStatus} />
        <DetailRow label="Manglik Status" value={data.manglikStatus} />
        <DetailRow label="Religion / Caste" value={data.religion && data.caste ? `${data.religion} / ${data.caste}` : data.religion || data.caste} />
        <DetailRow label="Sub-caste" value={data.subCaste} />
        <DetailRow label="Mother Tongue" value={data.motherTongue} />
      </SectionBlock>

      <SectionBlock titleSymbol="🏠" title="Family Background">
        <DetailRow label="Father's Name" value={data.fatherName} />
        <DetailRow label="Father's Occupation" value={data.fatherOccupation} />
        <DetailRow label="Mother's Name" value={data.motherName} />
        <DetailRow label="Mother's Occupation" value={data.motherOccupation} />
        <DetailRow label="Siblings" value={data.siblings} fullWidth />
        <DetailRow label="Family Type" value={data.familyType} />
        <DetailRow label="Family Values" value={data.familyValues} />
        <DetailRow label="Family Location" value={data.familyLocation} />
        <DetailRow label="Native Place" value={data.nativePlace} />
      </SectionBlock>

      <SectionBlock titleSymbol="🎓" title="Education">
        <DetailRow label="Degree / Highest Qualification" value={data.highestQualification} fullWidth/>
        <DetailRow label="College/University" value={data.collegeName} fullWidth/>
        <DetailRow label="Year of Completion" value={data.graduationYear} fullWidth/>
      </SectionBlock>

      <SectionBlock titleSymbol="💼" title="Professional Details">
        <DetailRow label="Occupation" value={data.occupation} />
        <DetailRow label="Company" value={data.companyName} />
        <DetailRow label="Role" value={data.role} />
        <DetailRow label="Work Mode" value={data.workMode} />
        <DetailRow label="Annual Income" value={data.annualIncome} />
      </SectionBlock>

      <SectionBlock titleSymbol="🧬" title="Lifestyle & Preferences">
        <DetailRow label="Diet" value={data.diet} />
        <DetailRow label="Smoking" value={data.smoking} />
        <DetailRow label="Drinking" value={data.drinking} />
        <DetailRow label="Languages Known" value={data.languagesKnown} />
        <DetailRow label="Hobbies & Interests" value={data.hobbies && data.interests ? `${data.hobbies}, ${data.interests}` : data.hobbies || data.interests} fullWidth/>
      </SectionBlock>
      
      <SectionBlock titleSymbol="📞" title="Contact Details">
        <DetailRow label="Mobile" value={data.phone} />
        <DetailRow label="Email" value={data.email} />
        <DetailRow label="Current Address" value={data.address} fullWidth />
        <DetailRow label="Contact Person" value={data.contactPerson} fullWidth />
      </SectionBlock>

      <footer className="mt-8 pt-4 text-center text-xs text-muted-foreground border-t border-border">
        Generated with ShaadiCraft
      </footer>
    </div>
  );
};

export default TraditionalLayout;
