import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

interface TermsScreenProps {
  onBack: () => void;
}

export default function TermsScreen({ onBack }: TermsScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Terms & Conditions</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Terms of Service</CardTitle>
            <p className="text-sm text-gray-500">Last updated: December 2024</p>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4 text-sm text-gray-600">
                <section>
                  <h3 className="font-semibold text-gray-900 mb-2">1. Acceptance of Terms</h3>
                  <p>By using this app, you agree to these terms and conditions. If you disagree with any part, please discontinue use.</p>
                </section>

                <section>
                  <h3 className="font-semibold text-gray-900 mb-2">2. Privacy & Data</h3>
                  <p>We collect minimal data necessary for app functionality. Location data is processed locally and not stored on our servers. User profiles and messages are encrypted.</p>
                </section>

                <section>
                  <h3 className="font-semibold text-gray-900 mb-2">3. User Conduct</h3>
                  <p>Users must behave respectfully. Harassment, spam, or inappropriate content will result in account suspension. Report violations through the app.</p>
                </section>

                <section>
                  <h3 className="font-semibold text-gray-900 mb-2">4. Bluetooth Usage</h3>
                  <p>The app requires Bluetooth permissions for proximity detection. This data is used solely for connecting nearby users and is not shared with third parties.</p>
                </section>

                <section>
                  <h3 className="font-semibold text-gray-900 mb-2">5. Account Security</h3>
                  <p>Users are responsible for account security. Use strong passwords and report suspicious activity immediately.</p>
                </section>

                <section>
                  <h3 className="font-semibold text-gray-900 mb-2">6. Service Availability</h3>
                  <p>We strive for 99% uptime but cannot guarantee uninterrupted service. Maintenance windows will be announced in advance.</p>
                </section>

                <section>
                  <h3 className="font-semibold text-gray-900 mb-2">7. Limitation of Liability</h3>
                  <p>The app is provided "as is" without warranties. We are not liable for any damages arising from app usage or user interactions.</p>
                </section>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}