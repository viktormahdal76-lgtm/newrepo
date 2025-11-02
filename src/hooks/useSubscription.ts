import { useState, useEffect } from 'react';
import { getUserSubscription, type SubscriptionTier, type UserSubscription } from '@/lib/subscription-service';

export function useSubscription(userId: string | null) {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [tier, setTier] = useState<SubscriptionTier>('free');

  useEffect(() => {
    if (!userId) {
      setSubscription(null);
      setTier('free');
      setLoading(false);
      return;
    }

    async function loadSubscription() {
      setLoading(true);
      const sub = await getUserSubscription(userId);
      setSubscription(sub);
      setTier(sub?.tier || 'free');
      setLoading(false);
    }

    loadSubscription();
  }, [userId]);

  return { subscription, tier, loading };
}
