import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Loader2, CreditCard } from 'lucide-react';
import { getStripe, createCheckoutSession } from '@/lib/stripe';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from 'sonner';

interface StripePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  amount: number;
  currency: string;
}

export function StripePaymentModal({ 
  isOpen, 
  onClose, 
  planName, 
  amount, 
  currency 
}: StripePaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAppContext();

  const handleStripeCheckout = async () => {
    if (!currentUser?.id) {
      toast.error('Please log in to subscribe');
      return;
    }

    setLoading(true);
    try {
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Stripe not initialized');
      }

      const { sessionId } = await createCheckoutSession({
        planName,
        amount,
        currency,
        userId: currentUser.id,
      });

      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Stripe checkout error:', error);
      toast.error(error.message || 'Payment failed');
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <p className="text-sm text-gray-500">
            {planName} - {currency.toUpperCase()} {amount}/month
          </p>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Button 
            onClick={handleStripeCheckout} 
            disabled={loading}
            className="w-full h-12"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-2" />
                Pay with Stripe
              </>
            )}
          </Button>
          
          <p className="text-xs text-center text-gray-500">
            Secure payment powered by Stripe
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
