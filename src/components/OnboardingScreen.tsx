import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

const INTERESTS = [
  'Coffee', 'Hiking', 'Music', 'Sports', 'Art', 'Food', 
  'Gaming', 'Reading', 'Travel', 'Fitness', 'Tech', 'Movies'
];

export default function OnboardingScreen() {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleComplete = async () => {
    if ( !auth.currentUser) return;
    
    setLoading(true);
    try {
      await setDoc(doc(db, 'profiles', auth.currentUser.uid), {
        email: auth.currentUser.email,
        fullName,
        age: parseInt(age),
        gender,
        interests: selectedInterests,
        bio,
        onboardingCompleted: true,
      });
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Complete Your Profile</h2>
          <p className="text-gray-600">Step {step} of 3</p>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <Input placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <Input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
            <select className="w-full p-2 border rounded" value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <Button onClick={() => setStep(2)} className="w-full" disabled={!fullName || !age || !gender}>Next</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm">Select your interests:</p>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map(interest => (
                <Badge
                  key={interest}
                  variant={selectedInterests.includes(interest) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </Badge>
              ))}
            </div>
            <Button onClick={() => setStep(3)} className="w-full" disabled={selectedInterests.length === 0}>Next</Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <textarea
              className="w-full p-2 border rounded min-h-[100px]"
              placeholder="Tell us about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <Button onClick={handleComplete} className="w-full" disabled={loading || !bio}>
              {loading ? 'Completing...' : 'Complete Profile'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
