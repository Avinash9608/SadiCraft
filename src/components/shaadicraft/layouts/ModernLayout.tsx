import React from 'react';
import Image from 'next/image';
import type { BiodataFormValues } from '@/lib/zod-schemas';
import { Separator } from '@/components/ui/separator';
import { User, Users, GraduationCap, Briefcase, Heart, Phone, Info, MapPin, Languages, Filter, ShieldCheck, Sparkles, Building, Aperture, Smile, CloudSun, Anchor,Palette, GitBranch, Globe, Handshake, Hourglass } from 'lucide-react';

interface ModernLayoutProps {
  data: BiodataFormValues;
}

const DetailItem: React.FC<{ label: string; value?: string; icon?: React.ElementType; fullWidth?: boolean }> = ({ label, value, icon: Icon, fullWidth }) => {
  if (!value && value !== '0') return null; // Allow '0' for age etc.
  return (
    <div className={`flex items-start space-x-3 py-2 ${fullWidth ? 'md:col-span-2' : ''}`}>
      {Icon && <Icon className="h-5 w-5 text-primary mt-1 shrink-0" />}
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-base text-foreground whitespace-pre-wrap">{value}</p>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode; className?: string }> = ({ title, icon: Icon, children, className }) => (
  <section className={`mb-6 p-4 md:p-6 bg-card rounded-lg shadow-md ${className}`}>
    <div className="flex items-center mb-4">
      <Icon className="h-6 w-6 text-primary mr-3" />
      <h3 className="text-xl font-semibold text-primary">{title}</h3>
    </div>
    <Separator className="mb-4" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">{children}</div>
  </section>
);


const ModernLayout: React.FC<ModernLayoutProps> = ({ data }) => {
  return (
    <div id="biodata-preview-content" className="p-2 md:p-4 bg-background rounded-lg shadow-xl font-body">
      <header className="text-center mb-8 p-6 bg-primary text-primary-foreground rounded-t-lg">
        {data.photo && (
          <div className="mx-auto w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-primary-foreground shadow-lg mb-4 -mt-16 md:-mt-20 relative bg-background">
            <Image src={data.photo} alt={data.fullName || 'Profile Photo'} layout="fill" objectFit="cover" data-ai-hint="profile portrait"/>
          </div>
        )}
        <h1 className="text-3xl md:text-4xl font-bold font-headline">{data.fullName || "Full Name"}</h1>
        {data.occupation && <p className="text-lg opacity-90">{data.occupation}{data.role && `, ${data.role}`}</p>}
      </header>

      {data.introduction && (
         <Section title="About Me" icon={Sparkles} className="md:col-span-2">
            <p className="text-base md:col-span-2 leading-relaxed whitespace-pre-wrap">{data.introduction}</p>
         </Section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Section title="Personal Information" icon={User}>
            <DetailItem label="Date of Birth" value={data.dob} icon={Aperture} />
            <DetailItem label="Age" value={data.age ? `${data.age} years` : undefined} icon={Hourglass}/>
            <DetailItem label="Gender" value={data.gender} icon={Users} />
            <DetailItem label="Height" value={data.height} icon={Anchor}/>
            <DetailItem label="Complexion" value={data.complexion} icon={Palette} />
            <DetailItem label="Blood Group" value={data.bloodGroup} icon={Heart} />
            <DetailItem label="Marital Status" value={data.maritalStatus} icon={Handshake}/>
            <DetailItem label="Manglik Status" value={data.manglikStatus} icon={ShieldCheck}/>
            <DetailItem label="Religion" value={data.religion} icon={Sparkles}/>
            <DetailItem label="Caste" value={data.caste} icon={Filter}/>
            <DetailItem label="Sub-caste" value={data.subCaste} icon={GitBranch}/>
            <DetailItem label="Mother Tongue" value={data.motherTongue} icon={Languages}/>
          </Section>

          <Section title="Educational Background" icon={GraduationCap}>
            <DetailItem label="Degree / Highest Qualification" value={data.highestQualification} fullWidth/>
            <DetailItem label="College/University" value={data.collegeName} fullWidth/>
            <DetailItem label="Year of Completion" value={data.graduationYear} fullWidth/>
          </Section>
        </div>

        <div>
          <Section title="Family Background" icon={Users}>
            <DetailItem label="Father's Name" value={data.fatherName} />
            <DetailItem label="Father's Occupation" value={data.fatherOccupation} />
            <DetailItem label="Mother's Name" value={data.motherName} />
            <DetailItem label="Mother's Occupation" value={data.motherOccupation} />
            <DetailItem label="Siblings" value={data.siblings} fullWidth/>
            <DetailItem label="Family Type" value={data.familyType} />
            <DetailItem label="Family Values" value={data.familyValues} />
            <DetailItem label="Family Location" value={data.familyLocation} icon={MapPin}/>
            <DetailItem label="Native Place" value={data.nativePlace} icon={Globe}/>
          </Section>

          <Section title="Professional Details" icon={Briefcase}>
            <DetailItem label="Occupation" value={data.occupation} />
            <DetailItem label="Role / Designation" value={data.role} />
            <DetailItem label="Company / Organization" value={data.companyName} icon={Building}/>
            <DetailItem label="Work Mode" value={data.workMode} />
            <DetailItem label="Annual Income" value={data.annualIncome} />
          </Section>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Section title="Lifestyle & Preferences" icon={Smile}>
            <DetailItem label="Dietary Preferences" value={data.diet} />
            <DetailItem label="Smoking Habits" value={data.smoking} />
            <DetailItem label="Drinking Habits" value={data.drinking} />
            <DetailItem label="Languages Known" value={data.languagesKnown} icon={Languages} />
            <DetailItem label="Hobbies" value={data.hobbies} fullWidth/>
            <DetailItem label="Interests" value={data.interests} fullWidth/>
        </Section>

        <Section title="Contact Information" icon={Phone}>
            <DetailItem label="Mobile" value={data.phone} />
            <DetailItem label="Email" value={data.email} />
            <DetailItem label="Current Address" value={data.address} icon={MapPin} fullWidth/>
            <DetailItem label="Contact Person" value={data.contactPerson} fullWidth/>
        </Section>
      </div>

       <footer className="mt-8 pt-4 text-center text-xs text-muted-foreground border-t border-border">
        Biodata generated by ShaadiCraft
      </footer>
    </div>
  );
};

export default ModernLayout;
