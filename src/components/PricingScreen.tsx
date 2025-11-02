import React, { useState } from 'react';
import { ChevronLeft, Check, Star, Zap, Crown } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { StripePaymentModal } from './StripePaymentModal';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

interface PricingScreenProps {
  onBack: () => void;
}

const plans = [
  {
    name: "Basic",
    price: { usd: 0, eur: 0 },
    icon: Star,
    color: "text-gray-600",
    features: [
      "Connect with up to 10 users",
      "Basic messaging",
      "50m detection radius",
      "Standard support"
    ]
  },
  {
    name: "Pro",
    price: { usd: 4.99, eur: 4.49 },
    icon: Zap,
    color: "text-blue-600",
    popular: true,
    features: [
      "Unlimited connections",
      "Voice & video calls",
      "100m detection radius",
      "Priority matching",
      "Advanced filters",
      "Read receipts",
      "Push notifications"
    ]
  },
  {
    name: "Premium",
    price: { usd: 9.99, eur: 8.99 },
    icon: Crown,
    color: "text-purple-600",
    features: [
      "Everything in Pro",
      "200m detection radius",
      "Invisible mode",
      "Super likes (10/day)",
      "Premium support",
      "Analytics dashboard",
      "Custom status",
      "Priority notifications"
    ]
  }
];

export default function PricingScreen({ onBack }: PricingScreenProps) {
  const [currency, setCurrency] = useState<'USD' | 'EUR'>('USD');
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const handleSelectPlan = (plan: typeof plans[0]) => {
    if (plan.price.usd === 0) {
      alert('You are now on the Basic plan!');
    } else {
      setSelectedPlan(plan);
      setShowPayment(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Pricing Plans</h1>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl text-gray-600 mb-4">Choose the plan that's right for you</h2>
          <div className="flex items-center justify-center gap-3">
            <Label>USD</Label>
            <Switch checked={currency === 'EUR'} onCheckedChange={(checked) => setCurrency(checked ? 'EUR' : 'USD')} />
            <Label>EUR</Label>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const displayPrice = currency === 'USD' ? plan.price.usd : plan.price.eur;
            const symbol = currency === 'USD' ? '$' : '€';
            
            return (
              <Card key={plan.name} className={`relative ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-2">
                    <Icon className={`h-8 w-8 ${plan.color}`} />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="text-2xl font-bold text-gray-900">
                    {displayPrice === 0 ? 'Free' : `${symbol}${displayPrice}/mo`}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => handleSelectPlan(plan)}
                  >
                    {displayPrice === 0 ? 'Get Started' : 'Subscribe'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {selectedPlan && (
        <StripePaymentModal
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          planName={selectedPlan.name}
          amount={currency === 'USD' ? selectedPlan.price.usd : selectedPlan.price.eur}
          currency={currency.toLowerCase()}
        />
      )}
    </div>
  );
}
