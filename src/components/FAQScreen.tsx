import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

interface FAQScreenProps {
  onBack: () => void;
}

const faqData = [
  {
    question: "How does proximity detection work?",
    answer: "Our app uses Bluetooth Low Energy (BLE) to detect nearby users within a 100-meter radius. Your device periodically scans for other users while respecting battery life and privacy."
  },
  {
    question: "Is my location data safe?",
    answer: "Yes! We don't store your exact location. We only use relative proximity data to show nearby users, and all data is encrypted and stored locally on your device."
  },
  {
    question: "Can I control who sees me?",
    answer: "Absolutely! You can set your discovery mode to visible, friends only, or invisible in your privacy settings. You have full control over your visibility."
  },
  {
    question: "How do I connect with someone?",
    answer: "Simply tap on a user in the radar view to send a connection request. Once they accept, you can chat, call, or arrange to meet up."
  },
  {
    question: "Does the app work offline?",
    answer: "Basic proximity detection works offline using Bluetooth. However, messaging and profile updates require an internet connection."
  },
  {
    question: "How accurate is the distance measurement?",
    answer: "Distance measurements are approximate and can vary based on obstacles, device capabilities, and environmental factors. Accuracy is typically within 5-10 meters."
  }
];

export default function FAQScreen({ onBack }: FAQScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">FAQ</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqData.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}