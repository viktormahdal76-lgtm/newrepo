import { Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface PricingCardProps {
  name: string;
  price: { usd: number; eur: number };
  features: string[];
  popular?: boolean;
  onSelect: () => void;
  currency: 'USD' | 'EUR';
}

export function PricingCard({ name, price, features, popular, onSelect, currency }: PricingCardProps) {
  const displayPrice = currency === 'USD' ? price.usd : price.eur;
  const symbol = currency === 'USD' ? '$' : '€';

  return (
    <Card className={`relative p-6 ${popular ? 'border-blue-500 border-2 shadow-xl' : ''}`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
          Most Popular
        </div>
      )}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">{name}</h3>
        <div className="text-4xl font-bold mb-2">
          {symbol}{displayPrice}
          <span className="text-lg text-gray-500">/month</span>
        </div>
      </div>
      <ul className="space-y-3 mb-6">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      <Button onClick={onSelect} className="w-full" variant={popular ? 'default' : 'outline'}>
        Choose Plan
      </Button>
    </Card>
  );
}
