import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { CreditCard, Loader2 } from 'lucide-react';



interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  amount: number;
  currency: string;
}

export function PaymentModal({ isOpen, onClose, planName, amount, currency }: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const handlePayPal = async () => {
    setLoading(true);
    // PayPal integration
    console.log('PayPal payment for', planName);
    setTimeout(() => {
      alert('PayPal payment successful!');
      setLoading(false);
      onClose();
    }, 2000);
  };

  const handleGooglePay = async () => {
    setLoading(true);
    console.log('Google Pay for', planName);
    setTimeout(() => {
      alert('Google Pay successful!');
      setLoading(false);
      onClose();
    }, 2000);
  };

  const handleApplePay = async () => {
    setLoading(true);
    console.log('Apple Pay for', planName);
    setTimeout(() => {
      alert('Apple Pay successful!');
      setLoading(false);
      onClose();
    }, 2000);
  };

  const handleCardPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log('Card payment for', planName);
    setTimeout(() => {
      alert('Payment successful!');
      setLoading(false);
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <p className="text-sm text-gray-500">
            {planName} - {currency}{amount}/month
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <Button onClick={handlePayPal} disabled={loading} variant="outline" className="w-full">
              PayPal
            </Button>
            <Button onClick={handleGooglePay} disabled={loading} variant="outline" className="w-full">
              Google Pay
            </Button>
            <Button onClick={handleApplePay} disabled={loading} variant="outline" className="w-full">
              Apple Pay
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or pay with card</span>
            </div>
          </div>

          <form onSubmit={handleCardPayment} className="space-y-4">
            <div>
              <Label>Card Number</Label>
              <Input
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Expiry</Label>
                <Input
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>CVC</Label>
                <Input
                  placeholder="123"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4 mr-2" />}
              Pay {currency}{amount}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
