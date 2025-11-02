// Background sync service for offline actions
export interface SyncAction {
  id: string;
  type: 'message' | 'profile' | 'meetup' | 'connection';
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
  retryCount: number;
}

const SYNC_QUEUE_KEY = 'huddleme_sync_queue';
const MAX_RETRIES = 3;

class SyncService {
  private queue: SyncAction[] = [];
  private listeners: Set<() => void> = new Set();
  private syncing = false;

  constructor() {
    this.loadQueue();
    this.setupOnlineListener();
  }

  private loadQueue() {
    try {
      const stored = localStorage.getItem(SYNC_QUEUE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (err) {
      console.error('Failed to load sync queue:', err);
    }
  }

  private saveQueue() {
    try {
      localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(this.queue));
      this.notifyListeners();
    } catch (err) {
      console.error('Failed to save sync queue:', err);
    }
  }

  private setupOnlineListener() {
    window.addEventListener('online', () => {
      this.processQueue();
    });
  }

  addAction(type: SyncAction['type'], action: SyncAction['action'], data: any) {
    const syncAction: SyncAction = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      action,
      data,
      timestamp: Date.now(),
      retryCount: 0
    };

    this.queue.push(syncAction);
    this.saveQueue();

    if (navigator.onLine) {
      this.processQueue();
    }

    return syncAction.id;
  }

  async processQueue() {
    if (this.syncing || this.queue.length === 0) return;

    this.syncing = true;
    const failedActions: SyncAction[] = [];

    for (const action of this.queue) {
      try {
        await this.executeAction(action);
      } catch (err) {
        console.error('Sync failed:', err);
        action.retryCount++;
        if (action.retryCount < MAX_RETRIES) {
          failedActions.push(action);
        }
      }
    }

    this.queue = failedActions;
    this.saveQueue();
    this.syncing = false;
  }

  private async executeAction(action: SyncAction): Promise<void> {
    // Import supabase dynamically to avoid circular deps
    const { supabase } = await import('./supabase');
    
    switch (action.type) {
      case 'message':
        return this.syncMessage(action, supabase);
      case 'profile':
        return this.syncProfile(action, supabase);
      case 'meetup':
        return this.syncMeetup(action, supabase);
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  private async syncMessage(action: SyncAction, supabase: any) {
    const { data, error } = await supabase
      .from('messages')
      .insert(action.data);
    
    if (error) throw error;
  }

  private async syncProfile(action: SyncAction, supabase: any) {
    const { data, error } = await supabase
      .from('profiles')
      .update(action.data)
      .eq('id', action.data.id);
    
    if (error) throw error;
  }

  private async syncMeetup(action: SyncAction, supabase: any) {
    if (action.action === 'create') {
      const { error } = await supabase
        .from('meetups')
        .insert(action.data);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('meetups')
        .update(action.data)
        .eq('id', action.data.id);
      if (error) throw error;
    }
  }

  getQueue(): SyncAction[] {
    return [...this.queue];
  }

  getPendingCount(): number {
    return this.queue.length;
  }

  isSyncing(): boolean {
    return this.syncing;
  }

  subscribe(callback: () => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners() {
    this.listeners.forEach(cb => cb());
  }
}

export const syncService = new SyncService();
