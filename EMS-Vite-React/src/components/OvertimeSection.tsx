import { Clock, TrendingUp, DollarSign } from 'lucide-react';
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

const overtimeRecords = [
  {
    id: 1,
    employee: 'Sarah Johnson',
    date: '2025-11-10',
    hours: 3,
    reason: 'Project Deadline',
    approved: true,
  },
  {
    id: 2,
    employee: 'Michael Chen',
    date: '2025-11-12',
    hours: 2.5,
    reason: 'Client Meeting',
    approved: true,
  },
  {
    id: 3,
    employee: 'Emily Rodriguez',
    date: '2025-11-13',
    hours: 4,
    reason: 'System Maintenance',
    approved: false,
  },
  {
    id: 4,
    employee: 'James Wilson',
    date: '2025-11-14',
    hours: 2,
    reason: 'Bug Fixes',
    approved: true,
  },
  {
    id: 5,
    employee: 'Lisa Anderson',
    date: '2025-11-15',
    hours: 3.5,
    reason: 'Sales Report',
    approved: false,
  },
];

export function OvertimeSection() {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const totalHours = overtimeRecords.reduce((sum, record) => sum + record.hours, 0);
  const approvedHours = overtimeRecords
    .filter((r) => r.approved)
    .reduce((sum, record) => sum + record.hours, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl mb-2">Overtime Tracking</h2>
        <p className="text-slate-600">Monitor and approve overtime hours</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Overtime</CardTitle>
            <Clock className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalHours} hrs</div>
            <p className="text-xs text-slate-600 mt-1">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Approved Hours</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{approvedHours} hrs</div>
            <p className="text-xs text-slate-600 mt-1">Ready for payment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Est. Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">${(approvedHours * 45).toFixed(0)}</div>
            <p className="text-xs text-slate-600 mt-1">Based on avg rate</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Overtime Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {overtimeRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                          {getInitials(record.employee)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{record.employee}</span>
                    </div>
                  </TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.hours} hrs</TableCell>
                  <TableCell>{record.reason}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        record.approved
                          ? 'bg-green-100 text-green-700 hover:bg-green-100'
                          : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                      }
                    >
                      {record.approved ? 'Approved' : 'Pending'}
                    </Badge>
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
