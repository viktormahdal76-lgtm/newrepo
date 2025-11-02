import React from 'react';
import { Button } from '@/components/ui/button';
import { Users, MessageCircle, MapPin } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-green-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Connect with People 
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent"> Nearby</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover meaningful connections in your area. Chat, meet, and build relationships with people who share your interests.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                onClick={onGetStarted}
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                Start Connecting
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="text-sm text-gray-600">Find People</p>
              </div>
              <div className="text-center">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <p className="text-sm text-gray-600">Start Chatting</p>
              </div>
              <div className="text-center">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <p className="text-sm text-gray-600">Meet Nearby</p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/68ab5f93edcb37324b4ec6b2_1756108877585_106414f7.webp"
              alt="People connecting with HuddleMe"
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;