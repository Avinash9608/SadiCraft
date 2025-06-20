import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionTitleProps {
  icon?: LucideIcon; // Optional icon
  title: string;
  className?: string;
  actions?: React.ReactNode; // For buttons like "Generate Intro"
}

const SectionTitle: React.FC<SectionTitleProps> = ({ icon: Icon, title, className, actions }) => (
  <div className={cn("flex items-center justify-between mb-6 pb-2 border-b border-border", className)}>
    <div className="flex items-center">
      {Icon && <Icon className="mr-3 h-6 w-6 text-primary" />}
      <h2 className="text-2xl font-headline font-semibold text-primary">
        {title}
      </h2>
    </div>
    {actions && <div>{actions}</div>}
  </div>
);

export default SectionTitle;
