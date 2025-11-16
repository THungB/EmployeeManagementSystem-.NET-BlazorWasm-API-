import { useState } from 'react';
import { User } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Plus, MessageSquare } from 'lucide-react';
import { EmployeeQueryForm } from './EmployeeQueryForm';

interface EmployeeQuerySectionProps {
  user: User;
}

const myQueries = [
  {
    id: 1,
    type: 'Overtime',
    subject: 'Overtime Request - Project Deadline',
    message: 'I need to work 3 extra hours to complete the client project.',
    date: '10/11/2025',
    status: 'Approved',
    response: 'Approved. Please log your hours in the system.',
  },
  {
    id: 2,
    type: 'Vacation',
    subject: 'Vacation Request - December',
    message: 'I would like to take vacation from Dec 20-31.',
    date: '08/11/2025',
    status: 'Pending',
    response: null,
  },
  {
    id: 3,
    type: 'Question',
    subject: 'Equipment Request',
    message: 'Can I get a new monitor for my workstation?',
    date: '05/11/2025',
    status: 'Approved',
    response: 'Approved. Please contact IT department to arrange delivery.',
  },
];

export function EmployeeQuerySection({ user }: EmployeeQuerySectionProps) {
  const [showForm, setShowForm] = useState(false);

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

  if (showForm) {
    return <EmployeeQueryForm user={user} onBack={() => setShowForm(false)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-slate-600">Submit requests and view responses</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Query
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl mb-2">
                {myQueries.filter(q => q.status === 'Pending').length}
              </div>
              <p className="text-sm text-slate-600">Pending Queries</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl mb-2">
                {myQueries.filter(q => q.status === 'Approved').length}
              </div>
              <p className="text-sm text-slate-600">Approved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl mb-2">{myQueries.length}</div>
              <p className="text-sm text-slate-600">Total Queries</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Queries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {myQueries.map((query) => (
              <div key={query.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{query.type}</Badge>
                      <Badge className={getStatusColor(query.status)}>
                        {query.status}
                      </Badge>
                    </div>
                    <h4 className="font-medium">{query.subject}</h4>
                    <p className="text-sm text-slate-600 mt-1">{query.message}</p>
                    {query.response && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg">
                        <p className="text-sm font-medium text-green-900 mb-1">
                          Manager Response:
                        </p>
                        <p className="text-sm text-green-700">{query.response}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-xs text-slate-500">{query.date}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
