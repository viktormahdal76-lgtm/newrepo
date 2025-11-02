import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bluetooth, Shield, Heart, MapPin, Users, Zap, MessageCircle, Calendar, Check, Star, Crown } from 'lucide-react';
import { PricingCard } from './PricingCard';
import { StripePaymentModal } from './StripePaymentModal';
import { QRCodeDownload } from './QRCodeDownload';


interface LandingPageProps {
  onGetStarted: () => void;
}

const pricingPlans = [
  {
    name: "Basic",
    price: { usd: 0, eur: 0 },
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
    features: [
      "Unlimited connections",
      "Voice & video calls",
      "100m detection radius",
      "Priority matching",
      "Advanced filters",
      "Read receipts",
      "Push notifications"
    ],
    popular: true
  },
  {
    name: "Premium",
    price: { usd: 9.99, eur: 8.99 },
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

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [currency, setCurrency] = useState<'USD' | 'EUR'>('USD');
  const [selectedPlan, setSelectedPlan] = useState<typeof pricingPlans[0] | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectPlan = (plan: typeof pricingPlans[0]) => {
    if (plan.price.usd === 0) {
      onGetStarted();
    } else {
      setSelectedPlan(plan);
      setShowPayment(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Bluetooth className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                HuddleMe
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection('features')} className="text-gray-700 hover:text-blue-600">Features</button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-gray-700 hover:text-blue-600">How It Works</button>
              <button onClick={() => scrollToSection('pricing')} className="text-gray-700 hover:text-blue-600">Pricing</button>
            </nav>
            <Button onClick={onGetStarted} className="bg-blue-600 hover:bg-blue-700">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Connect with People
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Right Around You
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Discover meaningful connections nearby using advanced Bluetooth technology. 
                Meet people who share your interests in real-time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button onClick={onGetStarted} size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg">
                  Start Connecting <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button onClick={() => scrollToSection('how-it-works')} variant="outline" size="lg" className="text-lg">
                  Learn More
                </Button>
              </div>
              
              {/* App Store Badges */}
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <a 
                  href="https://apps.apple.com/app/huddleme" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-105"
                >
                  <img 
                    src="https://d64gsuwffb70l.cloudfront.net/68ab5f93edcb37324b4ec6b2_1759755991524_afbbbf42.webp"
                    alt="Download on the App Store"
                    className="h-14 w-auto rounded-lg shadow-md"
                  />
                </a>
                <a 
                  href="https://play.google.com/store/apps/details?id=com.huddleme.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-105"
                >
                  <img 
                    src="https://d64gsuwffb70l.cloudfront.net/68ab5f93edcb37324b4ec6b2_1759755992382_45cd3b5e.webp"
                    alt="Get it on Google Play"
                    className="h-14 w-auto rounded-lg shadow-md"
                  />
                </a>
              </div>

            </div>
            <div className="relative">
              <img 
                src="https://d64gsuwffb70l.cloudfront.net/68ab5f93edcb37324b4ec6b2_1759746288883_bcfb2869.webp"
                alt="People connecting"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">Everything you need to connect with people nearby</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Bluetooth, title: 'BLE Technology', desc: 'Real-time proximity detection using Bluetooth Low Energy', color: 'blue' },
              { icon: Shield, title: 'Privacy First', desc: 'Your location stays private. No GPS tracking', color: 'green' },
              { icon: Heart, title: 'Smart Matching', desc: 'Find people with shared interests automatically', color: 'pink' },
              { icon: MapPin, title: 'Distance Tracking', desc: 'See how far away potential connections are', color: 'purple' },
              { icon: Users, title: 'Group Meetups', desc: 'Organize and join local group activities', color: 'indigo' },
              { icon: Zap, title: 'Instant Connect', desc: 'Auto-connect with matching profiles nearby', color: 'yellow' },
              { icon: MessageCircle, title: 'Real-time Chat', desc: 'Message connections instantly and securely', color: 'teal' },
              { icon: Calendar, title: 'Event Planning', desc: 'Schedule meetups at nearby venues', color: 'orange' },
            ].map((feature, idx) => (
              <div key={idx} className="p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
                <feature.icon className={`w-12 h-12 text-${feature.color}-600 mb-4`} />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Get started in three simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: '1', title: 'Create Profile', desc: 'Sign up and tell us about your interests' },
              { step: '2', title: 'Enable Bluetooth', desc: 'Turn on BLE to discover people nearby' },
              { step: '3', title: 'Start Connecting', desc: 'Match with people and start chatting' },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600 text-lg">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QR Code Download Section */}
      <section id="qr-download" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Scan to Download</h2>
            <p className="text-xl text-gray-600">
              Use your phone's camera to scan the QR code and download the app instantly
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <QRCodeDownload
              url="https://apps.apple.com/app/huddleme"
              title="iOS App Store"
              filename="huddleme-app-store-qr.png"
            />
            <QRCodeDownload
              url="https://play.google.com/store/apps/details?id=com.huddleme.app"
              title="Google Play Store"
              filename="huddleme-google-play-qr.png"
            />
          </div>
          <div className="text-center mt-8 text-gray-600">
            <p className="text-sm">Download these QR codes for your marketing materials, posters, or business cards</p>
          </div>
        </div>
      </section>


      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
            <p className="text-xl text-gray-600 mb-6">Select the perfect plan for your needs</p>
            <div className="flex items-center justify-center gap-3">
              <span className={`font-medium ${currency === 'USD' ? 'text-blue-600' : 'text-gray-500'}`}>USD</span>
              <button
                onClick={() => setCurrency(currency === 'USD' ? 'EUR' : 'USD')}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600"
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${currency === 'EUR' ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
              <span className={`font-medium ${currency === 'EUR' ? 'text-blue-600' : 'text-gray-500'}`}>EUR</span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <PricingCard
                key={plan.name}
                name={plan.name}
                price={plan.price}
                features={plan.features}
                popular={plan.popular}
                onSelect={() => handleSelectPlan(plan)}
                currency={currency}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Meet Amazing People?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users connecting with people nearby every day
          </p>
          <Button onClick={onGetStarted} size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg mb-8">
            Get Started Now <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          
          {/* App Store Badges in CTA */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <a 
              href="https://apps.apple.com/app/huddleme" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-transform hover:scale-105"
            >
              <img 
                src="https://d64gsuwffb70l.cloudfront.net/68ab5f93edcb37324b4ec6b2_1759755991524_afbbbf42.webp"
                alt="Download on the App Store"
                className="h-14 w-auto rounded-lg shadow-lg"
              />
            </a>
            <a 
              href="https://play.google.com/store/apps/details?id=com.huddleme.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-transform hover:scale-105"
            >
              <img 
                src="https://d64gsuwffb70l.cloudfront.net/68ab5f93edcb37324b4ec6b2_1759755992382_45cd3b5e.webp"
                alt="Get it on Google Play"
                className="h-14 w-auto rounded-lg shadow-lg"
              />
            </a>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Bluetooth className="w-6 h-6" />
                <span className="text-xl font-bold">HuddleMe</span>
              </div>
              <p className="text-gray-400">Connect with people nearby using Bluetooth technology</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => scrollToSection('features')}>Features</button></li>
                <li><button onClick={() => scrollToSection('pricing')}>Pricing</button></li>
                <li><button onClick={() => scrollToSection('how-it-works')}>How It Works</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button>About</button></li>
                <li><button>Blog</button></li>
                <li><button>Careers</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button>Privacy Policy</button></li>
                <li><button>Terms of Service</button></li>
                <li><button>Contact</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 HuddleMe. All rights reserved.</p>
          </div>
        </div>
      </footer>

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
};

export default LandingPage;
