import React from 'react';
import { Check, X, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const features = [
  { 
    category: 'Core Features', 
    items: [
      { name: 'Profile Creation', free: true, silver: true, gold: true, platinum: true },
      { name: 'Profile Views', free: '5 per day', silver: 'Unlimited', gold: 'Unlimited', platinum: 'Unlimited' },
      { name: 'Send Interests', free: '3 per month', silver: 'Unlimited', gold: 'Unlimited', platinum: 'Unlimited' },
      { name: 'Ad-Free Experience', free: false, silver: true, gold: true, platinum: true },
      { name: 'Basic Search Filters', free: true, silver: true, gold: true, platinum: true },
    ]
  },
  { 
    category: 'Premium Communication', 
    items: [
      { name: 'Contact Details Access', free: false, silver: true, gold: true, platinum: true },
      { name: 'Priority Messaging', free: false, silver: true, gold: true, platinum: true },
    ]
  },
  { 
    category: 'Profile Enhancement', 
    items: [
      { name: 'Verified Profile Badge', free: false, silver: true, gold: true, platinum: true },
      { name: 'Custom Biodata Templates', free: '1 Template', silver: 'All Templates', gold: 'All Templates', platinum: 'All Templates' },
      { name: 'Video Profile Upload', free: false, silver: false, gold: true, platinum: true },
    ]
  },
  {
    category: 'Search & Visibility',
    items: [
      { name: 'Advanced Filters', free: false, silver: true, gold: true, platinum: true },
      { name: 'Priority Listing', free: false, silver: true, gold: true, platinum: true },
      { name: 'Monthly Profile Boosts', free: false, silver: false, gold: false, platinum: '1 per month' },
    ]
  },
  {
    category: 'Exclusive Tools',
    items: [
      { name: 'SMS/WhatsApp Match Alerts', free: false, silver: false, gold: true, platinum: true },
      { name: 'Astro Compatibility Reports', free: false, silver: 'Add-on (₹99)', gold: '5 Free', platinum: '10 Free' },
      { name: 'Dedicated Relationship Manager', free: false, silver: false, gold: false, platinum: 'First 3 Months' },
    ]
  },
];

type Plan = 'free' | 'silver' | 'gold' | 'platinum';
const FeatureValue: React.FC<{ value: boolean | string }> = ({ value }) => {
  if (typeof value === 'boolean') {
    return value ? <Check className="h-6 w-6 text-green-500 mx-auto" /> : <X className="h-6 w-6 text-red-500 mx-auto" />;
  }
  return <span className="text-sm">{value}</span>;
};

const FeatureTable = () => {
  return (
    <div className="w-full max-w-6xl mx-auto bg-card rounded-lg shadow-lg overflow-hidden border border-border">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-muted/50">
            <th className="py-4 px-2 md:px-6 text-lg font-semibold text-foreground w-1/3">Features</th>
            <th className="py-4 px-2 md:px-6 text-lg font-semibold text-center text-foreground">Free</th>
            <th className="py-4 px-2 md:px-6 text-lg font-semibold text-center text-foreground">Silver</th>
            <th className="py-4 px-2 md:px-6 text-lg font-semibold text-center text-primary">
                Gold <Badge className="ml-2">Popular</Badge>
            </th>
             <th className="py-4 px-2 md:px-6 text-lg font-semibold text-center text-yellow-500">
                <div className="flex items-center justify-center">
                    <Star className="mr-2 h-5 w-5 text-yellow-400" /> Platinum
                </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {features.map((category, index) => (
            <React.Fragment key={category.category}>
              <tr className={cn("bg-muted/30", {"border-t-2 border-border": index > 0})}>
                <td colSpan={5} className="py-2 px-4 font-bold text-primary">{category.category}</td>
              </tr>
              {category.items.map((feature) => (
                 <tr key={feature.name} className="border-b border-border last:border-b-0">
                    <td className="py-3 px-2 md:px-6 font-medium text-foreground">{feature.name}</td>
                    <td className="py-3 px-2 md:px-6 text-center text-muted-foreground">
                        <FeatureValue value={feature.free} />
                    </td>
                    <td className="py-3 px-2 md:px-6 text-center text-muted-foreground">
                       <FeatureValue value={feature.silver} />
                    </td>
                    <td className="py-3 px-2 md:px-6 text-center font-semibold text-primary">
                        <FeatureValue value={feature.gold} />
                    </td>
                     <td className="py-3 px-2 md:px-6 text-center font-semibold text-yellow-600">
                        <FeatureValue value={feature.platinum} />
                    </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeatureTable;