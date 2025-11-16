import { useState } from 'react';
import { MessageSquare, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner@2.0.3';

interface Query {
  id: number;
  employeeName: string;
  employeeEmail: string;
  type: string;
  subject: string;
  message: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  response?: string;
}

const queries: Query[] = [
  {
    id: 1,
    employeeName: 'Sarah Johnson',
    employeeEmail: 'sarah.j@company.com',
    type: 'Overtime',
    subject: 'Overtime Request - Project Deadline',
    message: 'I need to work 3 extra hours on Friday to complete the client project deadline.',
    date: '2025-11-10',
    status: 'Pending',
  },
  {
    id: 2,
    employeeName: 'Michael Chen',
    employeeEmail: 'michael.c@company.com',
    type: 'Vacation',
    subject: 'Vacation Request - December',
    message: 'I would like to request vacation from December 20-31 for the holidays.',
    date: '2025-11-08',
    status: 'Pending',
  },
  {
    id: 3,
    employeeName: 'Emily Rodriguez',
    employeeEmail: 'emily.r@company.com',
    type: 'Question',
    subject: 'Health Insurance Coverage',
    message: 'Can you clarify what dental procedures are covered under our health insurance plan?',
    date: '2025-11-12',
    status: 'Approved',
    response: 'Our plan covers routine dental checkups, cleanings, and basic procedures. Please refer to the HR portal for the complete coverage details.',
  },
  {
    id: 4,
    employeeName: 'James Wilson',
    employeeEmail: 'james.w@company.com',
    type: 'Medical',
    subject: 'Medical Leave Request',
    message: 'I need to take medical leave from Nov 15-17 for a scheduled surgery.',
    date: '2025-11-05',
    status: 'Approved',
    response: 'Approved. Please submit your medical certificate after your recovery.',
  },
  {
    id: 5,
    employeeName: 'Lisa Anderson',
    employeeEmail: 'lisa.a@company.com',
    type: 'Complaint',
    subject: 'Equipment Issue',
    message: 'My laptop has been running very slowly and affecting my productivity.',
    date: '2025-11-13',
    status: 'Pending',
  },
];

export function QueriesSection() {
  const [queryList, setQueryList] = useState<Query[]>(queries);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [response, setResponse] = useState('');

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
      case 'Rejected':
        return 'bg-red-100 text-red-700 hover:bg-red-100';
      default:
        return '';
    }
  };

  const handleRespond = (queryId: number, status: 'Approved' | 'Rejected') => {
    if (!response.trim()) {
      toast('Please provide a response message', {
        description: 'A response is required when approving or rejecting queries.',
      });
      return;
    }

    setQueryList(prev =>
      prev.map(q =>
        q.id === queryId
          ? { ...q, status, response }
          : q
      )
    );

    toast(`Query ${status.toLowerCase()}!`, {
      description: `The employee will be notified of your response.`,
    });

    setResponse('');
    setSelectedQuery(null);
  };

  const pendingCount = queryList.filter(q => q.status === 'Pending').length;
  const approvedCount = queryList.filter(q => q.status === 'Approved').length;
  const rejectedCount = queryList.filter(q => q.status === 'Rejected').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl mb-2">Employee Queries</h2>
        <p className="text-slate-600">Review and respond to employee requests and questions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Pending Queries</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{pendingCount}</div>
            <p className="text-xs text-slate-600 mt-1">Awaiting response</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{approvedCount}</div>
            <p className="text-xs text-slate-600 mt-1">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{rejectedCount}</div>
            <p className="text-xs text-slate-600 mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Queries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {queryList.map((query) => (
              <div key={query.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <Avatar>
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                        {getInitials(query.employeeName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span>{query.employeeName}</span>
                        <Badge variant="outline">{query.type}</Badge>
                        <Badge className={getStatusColor(query.status)}>
                          {query.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">{query.employeeEmail}</p>
                      <h4 className="mt-2">{query.subject}</h4>
                      <p className="text-sm text-slate-600 mt-1">{query.message}</p>
                      
                      {query.response && (
                        <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                          <p className="text-sm font-medium mb-1">Your Response:</p>
                          <p className="text-sm text-slate-700">{query.response}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="text-xs text-slate-500">{query.date}</span>
                  {query.status === 'Pending' && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedQuery(query);
                            setResponse('');
                          }}
                          className="gap-2"
                        >
                          <MessageSquare className="w-3 h-3" />
                          Respond
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Respond to Query</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-slate-600 mb-1">From: {query.employeeName}</p>
                            <p className="font-medium">{query.subject}</p>
                            <p className="text-sm text-slate-600 mt-2">{query.message}</p>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Your Response</label>
                            <Textarea
                              placeholder="Type your response here..."
                              value={response}
                              onChange={(e) => setResponse(e.target.value)}
                              rows={4}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleRespond(query.id, 'Approved')}
                              className="gap-2 bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleRespond(query.id, 'Rejected')}
                              variant="destructive"
                              className="gap-2"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}