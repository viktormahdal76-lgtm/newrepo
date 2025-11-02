import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { toast } from '@/components/ui/use-toast';
import { useAppContext } from '@/contexts/AppContext';

export default function LoginScreen({ 
  onSignupClick, 
  onTermsClick, 
  onPrivacyClick 
}: { 
  onSignupClick: () => void;
  onTermsClick?: () => void;
  onPrivacyClick?: () => void;
}) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setDemoMode } = useAppContext();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for demo credentials
    if (email === 'demo' && password === 'demo') {
      setLoading(true);
      setTimeout(() => {
        setDemoMode();
        toast({ title: 'Welcome!', description: 'Logged in as demo user' });
        setLoading(false);
      }, 500);
      return;
    }
    
   
      setLoading(true);
      setTimeout(() => {
        setDemoMode();
        toast({ title: 'Logged In!', description: 'Using demo mode' });
        setLoading(false);
      }, 500);
      return;
    
    
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: 'Success!', description: 'Logged in successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
   
      setDemoMode();
      toast({ title: 'Demo Mode', description: 'Using demo mode - Firebase not configured' });
      return;
    

    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast({ title: 'Success!', description: 'Signed in with Google' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>
        
        { (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
            Demo mode available. Try: username "demo" / password "demo"
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email or Username</Label>
            <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or</span>
            </div>
          </div>
          
          <Button type="button" variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading}>
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </Button>
          
          <Button type="button" variant="ghost" className="w-full" onClick={onSignupClick}>
            Don't have an account? Sign Up
          </Button>
        </form>
        
        {/* Terms and Privacy Links */}
        <div className="mt-6 text-center text-xs text-gray-500">
          By logging in, you agree to our{' '}
          {onTermsClick ? (
            <button onClick={onTermsClick} className="text-blue-600 hover:underline">
              Terms & Conditions
            </button>
          ) : (
            <span className="text-blue-600">Terms & Conditions</span>
          )}
          {' '}and{' '}
          {onPrivacyClick ? (
            <button onClick={onPrivacyClick} className="text-blue-600 hover:underline">
              Privacy Policy
            </button>
          ) : (
            <span className="text-blue-600">Privacy Policy</span>
          )}
        </div>

      </Card>
    </div>
  );
}
