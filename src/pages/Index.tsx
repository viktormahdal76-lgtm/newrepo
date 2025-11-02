
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import AuthFlow from '@/components/AuthFlow';
import LandingPage from '@/components/LandingPage';
import { AppProvider, useAppContext } from '@/contexts/AppContext';

const AppContent: React.FC = () => {
  const { isAuthenticated, isOnboarded } = useAppContext();
  const [showLanding, setShowLanding] = useState(true);

  // Show landing page first
  if (showLanding && !isAuthenticated) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  // Show auth flow if not authenticated or not onboarded
  if (!isAuthenticated || !isOnboarded) {
    return <AuthFlow />;
  }

  // Show main app if authenticated and onboarded
  return <AppLayout />;
};

const Index: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default Index;

