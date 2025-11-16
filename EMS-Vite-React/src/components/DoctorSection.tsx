import { Stethoscope, Calendar, AlertCircle } from 'lucide-react';
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

const medicalLeaves = [
  {
    id: 1,
    employee: 'James Wilson',
    startDate: '2025-11-10',
    endDate: '2025-11-15',
    days: 5,
    reason: 'Medical Checkup',
    status: 'Active',
    certificate: true,
  },
  {
    id: 2,
    employee: 'Emily Rodriguez',
    startDate: '2025-11-05',
    endDate: '2025-11-07',
    days: 3,
    reason: 'Dental Procedure',
    status: 'Completed',
    certificate: true,
  },
  {
    id: 3,
    employee: 'David Park',
    startDate: '2025-11-20',
    endDate: '2025-11-22',
    days: 3,
    reason: 'Flu Recovery',
    status: 'Scheduled',
    certificate: false,
  },
  {
    id: 4,
    employee: 'Sarah Johnson',
    startDate: '2025-10-28',
    endDate: '2025-10-30',
    days: 3,
    reason: 'Surgery Follow-up',
    status: 'Completed',
    certificate: true,
  },
];

export function DoctorSection() {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
      case 'Completed':
        return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'Scheduled':
        return 'bg-purple-100 text-purple-700 hover:bg-purple-100';
      default:
        return '';
    }
  };

  const activeLeaves = medicalLeaves.filter((l) => l.status === 'Active').length;
  const totalDays = medicalLeaves.reduce((sum, leave) => sum + leave.days, 0);
  const noCertificate = medicalLeaves.filter((l) => !l.certificate).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl mb-2">Medical Leave</h2>
        <p className="text-slate-600">Track medical appointments and sick leave</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Medical Leave</CardTitle>
            <Stethoscope className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{activeLeaves}</div>
            <p className="text-xs text-slate-600 mt-1">Currently on leave</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Days</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalDays}</div>
            <p className="text-xs text-slate-600 mt-1">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Missing Certificates</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{noCertificate}</div>
            <p className="text-xs text-slate-600 mt-1">Require follow-up</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Medical Leave Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Certificate</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicalLeaves.map((leave) => (
                <TableRow key={leave.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                          {getInitials(leave.employee)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{leave.employee}</span>
                    </div>
                  </TableCell>
                  <TableCell>{leave.startDate}</TableCell>
                  <TableCell>{leave.endDate}</TableCell>
                  <TableCell>{leave.days} days</TableCell>
                  <TableCell>{leave.reason}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        leave.certificate
                          ? 'bg-green-100 text-green-700 hover:bg-green-100'
                          : 'bg-red-100 text-red-700 hover:bg-red-100'
                      }
                    >
                      {leave.certificate ? 'Provided' : 'Missing'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(leave.status)}>
                      {leave.status}
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
