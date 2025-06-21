
import { Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface PricingCardProps {
  title: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonVariant?: 'default' | 'outline';
  isPopular?: boolean;
  buttonLink?: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  period,
  description,
  features,
  buttonText,
  buttonVariant = 'default',
  isPopular = false,
  buttonLink,
}) => {
  return (
    <Card className={cn('flex flex-col', isPopular ? 'border-primary shadow-2xl relative' : '')}>
      {isPopular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>
      )}
      <CardHeader className="text-center">
        <CardTitle className={cn("text-2xl font-headline", title === "Platinum" && "text-yellow-500")}>
          {title === "Platinum" && <Star className="inline-block mr-2 mb-1 h-5 w-5 text-yellow-400" />}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-center mb-6">
          <span className="text-5xl font-extrabold">{price}</span>
          {period && <span className="text-muted-foreground">{period}</span>}
        </div>
        <ul className="space-y-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full" size="lg" variant={buttonVariant} asChild={!!buttonLink}>
          {buttonLink ? <Link href={buttonLink}>{buttonText}</Link> : <>{buttonText}</>}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
