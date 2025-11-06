import React, { useEffect, useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import AppHeader from './AppHeader';
import RadarScreen from './RadarScreen';
import ConnectionsScreen from './ConnectionsScreen';
import ChatScreen from './ChatScreen';
import ProfileScreen from './ProfileScreen';
import SettingsScreen from './SettingsScreen';
import FAQScreen from './FAQScreen';
import AboutScreen from './AboutScreen';
import TermsScreen from './TermsScreen';
import PrivacyScreen from './PrivacyScreen';
import PricingScreen from './PricingScreen';
import MeetupsScreen from './MeetupsScreen';
import BottomNavigation from './BottomNavigation';
import WebsiteHeader from './WebsiteHeader';
import HeroSection from './HeroSection';
import { AdminDashboard } from './AdminDashboard';
import { adminService } from '@/lib/admin-service';
import InstallPrompt from './InstallPrompt';
import SyncStatusIndicator from './SyncStatusIndicator';
import LocationPermissionModal from './LocationPermissionModal';



const AppLayout: React.FC = () => {
  const { currentScreen, setCurrentScreen, authUser } = useAppContext();
  const showLocationModal = true;
  const [isAdmin, setIsAdmin] = useState(false);


  useEffect(() => {
    const checkAdmin = async () => {
      if (authUser?.email) {
        const admin = await adminService.isAdmin(authUser.email);
        setIsAdmin(admin);
      }
    };
    checkAdmin();
  }, [authUser]);

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as any);
  };

  const handleBack = () => {
    setCurrentScreen('settings');
  };


  // Website landing page
  if (currentScreen === 'website') {
    return (
      <div className="min-h-screen bg-white">
        <WebsiteHeader />
        <HeroSection />
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Connect with People Nearby</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-blue-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Real-time Discovery</h3>
                <p className="text-gray-600">Find people within your proximity using advanced Bluetooth technology</p>
              </div>
              <div className="p-6 bg-green-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Privacy First</h3>
                <p className="text-gray-600">Your location data stays on your device. We never track your exact position</p>
              </div>
              <div className="p-6 bg-purple-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Smart Matching</h3>
                <p className="text-gray-600">Filter by interests, age, and preferences to find your perfect connections</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'admin':
        if (!isAdmin) {
          return (
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
              <p className="text-gray-600">You do not have permission to access the admin dashboard.</p>
            </div>
          );
        }
        return <AdminDashboard />;
      case 'radar':
        return <RadarScreen />;
      case 'connections':
        return <ConnectionsScreen />;
      case 'meetups':
        return <MeetupsScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'settings':
        return <SettingsScreen onNavigate={handleNavigate} isAdmin={isAdmin} />;
      case 'chat':
        return <ChatScreen />;
      case 'faq':
        return <FAQScreen onBack={handleBack} />;
      case 'about':
        return <AboutScreen onBack={handleBack} />;
      case 'terms':
        return <TermsScreen onBack={handleBack} />;
      case 'privacy':
        return <PrivacyScreen onBack={handleBack} />;
      case 'pricing':
        return <PricingScreen onBack={handleBack} />;
      default:
        return <RadarScreen />;
    }
  };


  const shouldShowBottomNav = !['faq', 'about', 'terms', 'privacy', 'pricing', 'admin'].includes(currentScreen);


  return (
    <div className="flex flex-col h-screen bg-white">
      <AppHeader />
      <main className={`flex-1 overflow-hidden ${shouldShowBottomNav ? 'pb-16' : ''}`}>
        {renderScreen()}
      </main>
      {shouldShowBottomNav && <BottomNavigation />}
      <InstallPrompt />
      <SyncStatusIndicator />
      <LocationPermissionModal />
    </div>
  );
};

export default AppLayout;
