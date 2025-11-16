import { User } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Mail, Phone, MessageCircle, FileText, HelpCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useState } from 'react';

interface EmployeeSupportProps {
  user: User;
}

const faqs = [
  {
    question: 'How do I request vacation time?',
    answer: 'Go to the Queries section and select "Vacation Request" as the query type. Fill in the dates and submit.',
  },
  {
    question: 'Where can I find my payslip?',
    answer: 'Payslips are sent to your company email at the end of each month. Contact HR if you need a copy.',
  },
  {
    question: 'How do I update my personal information?',
    answer: 'Click on "My Profile" in the sidebar, then click the "Edit Profile" button to update your details.',
  },
  {
    question: 'Who do I contact for IT support?',
    answer: 'You can reach IT support at it.support@company.com or call extension 1234.',
  },
];

export function EmployeeSupport({ user }: EmployeeSupportProps) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) {
      toast('Please fill in all fields', {
        description: 'Subject and message are required.',
      });
      return;
    }

    toast('Support ticket created!', {
      description: 'We will respond to your inquiry within 24 hours.',
    });
    setSubject('');
    setMessage('');
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-slate-600">Get help and support for your queries</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="pt-6 text-center">
            <Mail className="w-8 h-8 mx-auto mb-3 text-indigo-600" />
            <h3 className="font-medium mb-1">Email Support</h3>
            <p className="text-sm text-slate-600">hr@company.com</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="pt-6 text-center">
            <Phone className="w-8 h-8 mx-auto mb-3 text-green-600" />
            <h3 className="font-medium mb-1">Phone Support</h3>
            <p className="text-sm text-slate-600">+1 (555) 000-0000</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="pt-6 text-center">
            <MessageCircle className="w-8 h-8 mx-auto mb-3 text-purple-600" />
            <h3 className="font-medium mb-1">Live Chat</h3>
            <p className="text-sm text-slate-600">Mon-Fri, 9AM-5PM</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-l-4 border-indigo-500 pl-4 py-2">
                <div className="flex items-start gap-2">
                  <HelpCircle className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium mb-1">{faq.question}</h4>
                    <p className="text-sm text-slate-600">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Submit Support Ticket
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="support-subject">Subject</Label>
              <Input
                id="support-subject"
                placeholder="Brief description of your issue"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-message">Message</Label>
              <Textarea
                id="support-message"
                placeholder="Describe your issue in detail..."
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Submit Ticket
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Knowledge Base</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button variant="outline" className="h-auto justify-start p-4">
              <div className="text-left">
                <p className="font-medium mb-1">Employee Handbook</p>
                <p className="text-xs text-slate-500">Company policies and guidelines</p>
              </div>
            </Button>
            <Button variant="outline" className="h-auto justify-start p-4">
              <div className="text-left">
                <p className="font-medium mb-1">Benefits Guide</p>
                <p className="text-xs text-slate-500">Health insurance and perks</p>
              </div>
            </Button>
            <Button variant="outline" className="h-auto justify-start p-4">
              <div className="text-left">
                <p className="font-medium mb-1">IT Resources</p>
                <p className="text-xs text-slate-500">Software and system guides</p>
              </div>
            </Button>
            <Button variant="outline" className="h-auto justify-start p-4">
              <div className="text-left">
                <p className="font-medium mb-1">Training Materials</p>
                <p className="text-xs text-slate-500">Professional development</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
