
import { Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const features = [
  { name: 'Profile Creation', free: true, premium: true },
  { name: 'Profile Views', free: '5 per day', premium: 'Unlimited' },
  { name: 'Send Interests', free: '3 per month', premium: 'Unlimited' },
  { name: 'Ad-Free Experience', free: false, premium: true },
  { name: 'Contact Details Access', free: false, premium: true },
  { name: 'Advanced Search Filters', free: false, premium: true },
  { name: 'Priority Listing in Search', free: false, premium: true },
  { name: 'Verified Profile Badge', free: false, premium: true },
  { name: 'Custom Biodata Templates', free: false, premium: true },
  { name: 'Video Profiles', free: false, premium: true },
  { name: 'Match Alerts (SMS/WhatsApp)', free: false, premium: true },
];

const FeatureRow = ({ name, free, premium }: { name: string, free: boolean | string, premium: boolean | string }) => (
  <tr className="border-b border-border">
    <td className="py-4 px-2 md:px-6 font-medium text-foreground">{name}</td>
    <td className="py-4 px-2 md:px-6 text-center text-muted-foreground">
      {typeof free === 'boolean' ? (
        free ? <Check className="h-6 w-6 text-green-500 mx-auto" /> : <X className="h-6 w-6 text-red-500 mx-auto" />
      ) : (
        <span>{free}</span>
      )}
    </td>
    <td className="py-4 px-2 md:px-6 text-center text-primary font-semibold">
      {typeof premium === 'boolean' ? (
        premium ? <Check className="h-6 w-6 text-green-500 mx-auto" /> : <X className="h-6 w-6 text-red-500 mx-auto" />
      ) : (
        <span>{premium}</span>
      )}
    </td>
  </tr>
);


const FeatureTable = () => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-card rounded-lg shadow-lg overflow-hidden border border-border">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-muted/50">
            <th className="py-4 px-2 md:px-6 text-lg font-semibold text-foreground">Features</th>
            <th className="py-4 px-2 md:px-6 text-lg font-semibold text-center text-foreground">Free Plan</th>
            <th className="py-4 px-2 md:px-6 text-lg font-semibold text-center text-primary">
                Premium Plan <Badge className="ml-2">Popular</Badge>
            </th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature) => (
            <FeatureRow key={feature.name} {...feature} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeatureTable;
