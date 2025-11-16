import { Calendar, Plus, Check, X, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { toast } from 'sonner@2.0.3';
import { useState } from 'react';

const vacationRequests = [
  {
    id: 1,
    employee: 'Sarah Johnson',
    startDate: '2025-12-20',
    endDate: '2025-12-31',
    days: 12,
    type: 'Annual Leave',
    status: 'Approved',
  },
  {
    id: 2,
    employee: 'Michael Chen',
    startDate: '2025-11-25',
    endDate: '2025-11-29',
    days: 5,
    type: 'Personal Leave',
    status: 'Pending',
  },
  {
    id: 3,
    employee: 'Emily Rodriguez',
    startDate: '2025-11-18',
    endDate: '2025-11-22',
    days: 5,
    type: 'Annual Leave',
    status: 'Approved',
  },
  {
    id: 4,
    employee: 'James Wilson',
    startDate: '2025-12-01',
    endDate: '2025-12-15',
    days: 15,
    type: 'Sick Leave',
    status: 'Pending',
  },
  {
    id: 5,
    employee: 'Lisa Anderson',
    startDate: '2025-11-10',
    endDate: '2025-11-12',
    days: 3,
    type: 'Personal Leave',
    status: 'Rejected',
  },
];

export function VacationSection() {
  const [requests, setRequests] = useState(vacationRequests);

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

  const handleApprove = (id: number) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === id ? { ...req, status: 'Approved' as const } : req
      )
    );
    toast('Vacation request approved!', {
      description: 'The employee has been notified.',
    });
  };

  const handleReject = (id: number) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === id ? { ...req, status: 'Rejected' as const } : req
      )
    );
    toast('Vacation request rejected', {
      description: 'The employee has been notified.',
    });
  };

  const pendingCount = requests.filter(r => r.status === 'Pending').length;
  const approvedCount = requests.filter(r => r.status === 'Approved').length;
  const totalDays = requests.reduce((sum, req) => sum + req.days, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl mb-2">Vacation Management</h2>
          <p className="text-slate-600">Review and manage employee vacation requests</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Request
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{pendingCount}</div>
            <p className="text-xs text-slate-600 mt-1">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Approved This Month</CardTitle>
            <Check className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{approvedCount}</div>
            <p className="text-xs text-slate-600 mt-1">November 2025</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Days Requested</CardTitle>
            <Calendar className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalDays}</div>
            <p className="text-xs text-slate-600 mt-1">Across all requests</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vacation Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                          {getInitials(request.employee)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{request.employee}</span>
                    </div>
                  </TableCell>
                  <TableCell>{request.startDate}</TableCell>
                  <TableCell>{request.endDate}</TableCell>
                  <TableCell>{request.days} days</TableCell>
                  <TableCell>{request.type}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {request.status === 'Pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 text-green-600 border-green-300 hover:bg-green-50"
                          onClick={() => handleApprove(request.id)}
                        >
                          <Check className="w-3 h-3" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 text-red-600 border-red-300 hover:bg-red-50"
                          onClick={() => handleReject(request.id)}
                        >
                          <X className="w-3 h-3" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}