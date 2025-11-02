
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { syncService } from './lib/sync-service'

// Register service worker for PWA offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('SW registered:', registration);
        
        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000); // Check every minute

        // Register background sync
        if ('sync' in registration) {
          registration.sync.register('sync-queue').catch(console.error);
        }
      })
      .catch((error) => {
        console.log('SW registration failed:', error);
      });

    // Listen for sync messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'PROCESS_SYNC_QUEUE') {
        syncService.processQueue();
      }
    });
  });
}

// Remove dark mode class addition
createRoot(document.getElementById("root")!).render(<App />);

