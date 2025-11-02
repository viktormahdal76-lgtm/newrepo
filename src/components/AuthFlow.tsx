import { useState } from 'react';
import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';
import OnboardingScreen from './OnboardingScreen';
import TermsScreen from './TermsScreen';
import PrivacyScreen from './PrivacyScreen';
import { useAppContext } from '@/contexts/AppContext';

type AuthView = 'login' | 'signup' | 'terms' | 'privacy';

export default function AuthFlow() {
  const [currentView, setCurrentView] = useState<AuthView>('login');
  const { isAuthenticated, isOnboarded } = useAppContext();

  // Show onboarding if authenticated but not onboarded
  if (isAuthenticated && !isOnboarded) {
    return <OnboardingScreen />;
  }

  // Show terms or privacy
  if (currentView === 'terms') {
    return <TermsScreen onBack={() => setCurrentView('login')} />;
  }
  
  if (currentView === 'privacy') {
    return <PrivacyScreen onBack={() => setCurrentView('login')} />;
  }

  // Show login/signup flow
  if (currentView === 'signup') {
    return (
      <SignupScreen 
        onBack={() => setCurrentView('login')}
        onTermsClick={() => setCurrentView('terms')}
        onPrivacyClick={() => setCurrentView('privacy')}
      />
    );
  }

  return (
    <LoginScreen 
      onSignupClick={() => setCurrentView('signup')}
      onTermsClick={() => setCurrentView('terms')}
      onPrivacyClick={() => setCurrentView('privacy')}
    />
  );
}
