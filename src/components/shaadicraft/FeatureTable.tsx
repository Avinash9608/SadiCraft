
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
      { name: 'All Biodata Templates', free: false, silver: true, gold: true, platinum: true },
    ]
  },
  { 
    category: 'Communication', 
    items: [
      { name: 'View Contact Details', free: false, silver: true, gold: true, platinum: true },
      { name: 'Advanced Search Filters', free: false, silver: true, gold: true, platinum: true },
      { name: 'Priority Listing in Search', free: false, silver: true, gold: true, platinum: true },
    ]
  },
  { 
    category: 'Profile Enhancement', 
    items: [
      { name: 'Verified Profile Badge', free: false, silver: true, gold: true, platinum: true },
      { name: 'Video Profile Upload', free: false, silver: false, gold: true, platinum: true },
    ]
  },
  {
    category: 'Exclusive Perks',
    items: [
      { name: 'SMS/WhatsApp Match Alerts', free: false, silver: false, gold: true, platinum: true },
      { name: 'Astro Compatibility Reports', free: false, silver: false, gold: '5 Free', platinum: '10 Free' },
      { name: 'Monthly Profile Boosts', free: false, silver: false, gold: false, platinum: '1 per month' },
      { name: 'Dedicated Relationship Manager', free: false, silver: false, gold: false, platinum: 'First 3 Months' },
      { name: 'Lifetime Validity', free: false, silver: false, gold: false, platinum: true },
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
        <thead className="hidden md:table-header-group">
          <tr className="bg-muted/50">
            <th className="py-4 px-6 text-lg font-semibold text-foreground w-1/3">Features</th>
            <th className="py-4 px-6 text-lg font-semibold text-center text-foreground">Free</th>
            <th className="py-4 px-6 text-lg font-semibold text-center text-primary">
                Silver <Badge className="ml-2">Popular</Badge>
            </th>
            <th className="py-4 px-6 text-lg font-semibold text-center text-foreground">Gold</th>
            <th className="py-4 px-6 text-lg font-semibold text-center text-yellow-500">
                <div className="flex items-center justify-center">
                    <Star className="mr-2 h-5 w-5 text-yellow-400" /> Platinum
                </div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {features.map((category, index) => (
            <React.Fragment key={category.category}>
              <tr className={cn("bg-muted/30", {"border-t-2 border-border": index > 0})}>
                <td colSpan={5} className="py-3 px-4 font-bold text-primary text-base md:text-lg">{category.category}</td>
              </tr>
              {category.items.map((feature) => (
                 <tr key={feature.name} className="flex flex-col md:table-row py-2 md:py-0 border-b md:border-b-0">
                    <td className="py-3 px-4 font-medium text-foreground">{feature.name}</td>
                    <td className="py-3 px-4 text-left md:text-center text-muted-foreground" data-label="Free: ">
                        <FeatureValue value={feature.free} />
                    </td>
                    <td className="py-3 px-4 text-left md:text-center font-semibold text-primary" data-label="Silver: ">
                       <FeatureValue value={feature.silver} />
                    </td>
                    <td className="py-3 px-4 text-left md:text-center text-muted-foreground" data-label="Gold: ">
                        <FeatureValue value={feature.gold} />
                    </td>
                     <td className="py-3 px-4 text-left md:text-center font-semibold text-yellow-600" data-label="Platinum: ">
                        <FeatureValue value={feature.platinum} />
                    </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        @media (max-width: 767px) {
            td:not(:first-child)::before {
                content: attr(data-label);
                font-weight: bold;
                margin-right: 0.5rem;
                display: inline-block;
                width: 80px; /* Adjust as needed */
            }
            td {
                display: block;
                text-align: right;
            }
            td:first-child {
                text-align: left;
                font-size: 1.1rem;
                background-color: hsl(var(--muted) / 0.5);
            }
        }
      `}</style>
    </div>
  );
};

export default FeatureTable;
