import { supabase } from './supabase';

export type SubscriptionTier = 'free' | 'pro' | 'premium';

export interface UserSubscription {
  id: string;
  user_id: string;
  tier: SubscriptionTier;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  current_period_end?: string;
}

export const TIER_LIMITS = {
  free: {
    maxConnections: 5,
    detectionRadius: 50, // meters
    canUseAdvancedFilters: false,
    canSeeExtendedProfiles: false,
    maxMeetupProposals: 2,
  },
  pro: {
    maxConnections: 50,
    detectionRadius: 200,
    canUseAdvancedFilters: true,
    canSeeExtendedProfiles: true,
    maxMeetupProposals: 10,
  },
  premium: {
    maxConnections: Infinity,
    detectionRadius: 500,
    canUseAdvancedFilters: true,
    canSeeExtendedProfiles: true,
    maxMeetupProposals: Infinity,
  },
};

export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }

  return data;
}

export function canAccessFeature(tier: SubscriptionTier, feature: string): boolean {
  const limits = TIER_LIMITS[tier];
  
  switch (feature) {
    case 'advanced_filters':
      return limits.canUseAdvancedFilters;
    case 'extended_profiles':
      return limits.canSeeExtendedProfiles;
    case 'unlimited_connections':
      return limits.maxConnections === Infinity;
    default:
      return true;
  }
}
