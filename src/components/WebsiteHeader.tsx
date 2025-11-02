import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

interface WebsiteHeaderProps {
  onGetStarted: () => void;
}

const WebsiteHeader: React.FC<WebsiteHeaderProps> = ({ onGetStarted }) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage 
                src="https://d64gsuwffb70l.cloudfront.net/68ab5f93edcb37324b4ec6b2_1756061824709_12a93fbe.webp" 
                alt="HuddleMe" 
              />
            </Avatar>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              HuddleMe
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
            <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
            <Button onClick={onGetStarted} className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
              Get Started
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default WebsiteHeader;