import { AlertTriangle, TrendingDown, FileText } from 'lucide-react';
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

const sanctions = [
  {
    id: 1,
    employee: 'Michael Chen',
    date: '2025-11-08',
    type: 'Warning',
    reason: 'Late Arrival',
    severity: 'Low',
    resolved: false,
  },
  {
    id: 2,
    employee: 'James Wilson',
    date: '2025-10-25',
    type: 'Written Warning',
    reason: 'Missed Deadline',
    severity: 'Medium',
    resolved: true,
  },
  {
    id: 3,
    employee: 'Lisa Anderson',
    date: '2025-11-12',
    type: 'Verbal Warning',
    reason: 'Policy Violation',
    severity: 'Low',
    resolved: false,
  },
  {
    id: 4,
    employee: 'David Park',
    date: '2025-10-15',
    type: 'Suspension',
    reason: 'Misconduct',
    severity: 'High',
    resolved: true,
  },
];

export function SanctionsSection() {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
      case 'Medium':
        return 'bg-orange-100 text-orange-700 hover:bg-orange-100';
      case 'High':
        return 'bg-red-100 text-red-700 hover:bg-red-100';
      default:
        return '';
    }
  };

  const activeSanctions = sanctions.filter((s) => !s.resolved).length;
  const resolvedSanctions = sanctions.filter((s) => s.resolved).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl mb-2">Sanctions & Warnings</h2>
        <p className="text-slate-600">Monitor disciplinary actions and warnings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Sanctions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{activeSanctions}</div>
            <p className="text-xs text-slate-600 mt-1">Pending resolution</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Resolved</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{resolvedSanctions}</div>
            <p className="text-xs text-slate-600 mt-1">Closed cases</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Records</CardTitle>
            <FileText className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{sanctions.length}</div>
            <p className="text-xs text-slate-600 mt-1">All time</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sanction Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sanctions.map((sanction) => (
                <TableRow key={sanction.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                          {getInitials(sanction.employee)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{sanction.employee}</span>
                    </div>
                  </TableCell>
                  <TableCell>{sanction.date}</TableCell>
                  <TableCell>{sanction.type}</TableCell>
                  <TableCell>{sanction.reason}</TableCell>
                  <TableCell>
                    <Badge className={getSeverityColor(sanction.severity)}>
                      {sanction.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        sanction.resolved
                          ? 'bg-green-100 text-green-700 hover:bg-green-100'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                      }
                    >
                      {sanction.resolved ? 'Resolved' : 'Active'}
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
