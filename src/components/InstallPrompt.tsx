import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt after a short delay to ensure it's visible
      setTimeout(() => {
        const dismissed = localStorage.getItem('installPromptDismissed');
        const dismissedTime = localStorage.getItem('installPromptDismissedTime');
        
        // Show again if dismissed more than 7 days ago, or never dismissed
        const shouldShow = !dismissed || 
          (dismissedTime && Date.now() - parseInt(dismissedTime) > 7 * 24 * 60 * 60 * 1000);
        
        if (shouldShow) {
          setShowPrompt(true);
        }
      }, 2000); // Show after 2 seconds
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);


  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('App installed');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('installPromptDismissed', 'true');
    localStorage.setItem('installPromptDismissedTime', Date.now().toString());
  };


  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <Card className="p-4 shadow-lg border-2 border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex items-start gap-3">
          <div className="bg-purple-500 p-2 rounded-lg">
            <Download className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-1">Install HuddleMe</h3>
            <p className="text-sm text-gray-600 mb-3">
              Add to your home screen for quick access and offline support
            </p>
            
            <Button 
              onClick={handleInstall}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
            >
              Install App
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
