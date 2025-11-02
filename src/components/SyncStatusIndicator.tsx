import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Cloud, CloudOff, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { syncService } from '@/lib/sync-service';

const SyncStatusIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const updateStatus = () => {
      setIsOnline(navigator.onLine);
      setPendingCount(syncService.getPendingCount());
      setIsSyncing(syncService.isSyncing());
    };

    const handleOnline = () => {
      setIsOnline(true);
      syncService.processQueue();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    const unsubscribe = syncService.subscribe(updateStatus);
    updateStatus();

    const interval = setInterval(updateStatus, 2000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  if (isOnline && pendingCount === 0 && !isSyncing) {
    return null; // Don't show when everything is synced
  }

  const getStatusInfo = () => {
    if (!isOnline) {
      return {
        icon: <CloudOff className="w-3 h-3" />,
        text: 'Offline',
        variant: 'destructive' as const,
        subtext: pendingCount > 0 ? `${pendingCount} pending` : ''
      };
    }
    
    if (isSyncing) {
      return {
        icon: <RefreshCw className="w-3 h-3 animate-spin" />,
        text: 'Syncing',
        variant: 'default' as const,
        subtext: `${pendingCount} items`
      };
    }
    
    if (pendingCount > 0) {
      return {
        icon: <AlertCircle className="w-3 h-3" />,
        text: 'Pending',
        variant: 'secondary' as const,
        subtext: `${pendingCount} items`
      };
    }

    return {
      icon: <CheckCircle className="w-3 h-3" />,
      text: 'Synced',
      variant: 'default' as const,
      subtext: ''
    };
  };

  const status = getStatusInfo();

  return (
    <Badge 
      variant={status.variant}
      className="flex items-center gap-1.5 text-xs px-2 py-1"
    >
      {status.icon}
      <span>{status.text}</span>
      {status.subtext && (
        <span className="opacity-75">· {status.subtext}</span>
      )}
    </Badge>
  );
};

export default SyncStatusIndicator;
