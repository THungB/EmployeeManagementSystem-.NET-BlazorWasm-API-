import { useState } from 'react';
import { Search, Plus, Mail, Phone, MoreVertical } from 'lucide-react';
import { Input } from './ui/input';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { AddEmployeeDialog } from './AddEmployeeDialog';

const employees = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.j@company.com',
    phone: '+1 (555) 123-4567',
    department: 'Engineering',
    position: 'Senior Developer',
    status: 'Active',
    startDate: '2022-01-15',
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'michael.c@company.com',
    phone: '+1 (555) 234-5678',
    department: 'Marketing',
    position: 'Marketing Manager',
    status: 'Active',
    startDate: '2021-06-10',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    email: 'emily.r@company.com',
    phone: '+1 (555) 345-6789',
    department: 'HR',
    position: 'HR Specialist',
    status: 'Active',
    startDate: '2023-03-20',
  },
  {
    id: 4,
    name: 'James Wilson',
    email: 'james.w@company.com',
    phone: '+1 (555) 456-7890',
    department: 'Engineering',
    position: 'Frontend Developer',
    status: 'On Leave',
    startDate: '2022-09-05',
  },
  {
    id: 5,
    name: 'Lisa Anderson',
    email: 'lisa.a@company.com',
    phone: '+1 (555) 567-8901',
    department: 'Sales',
    position: 'Sales Director',
    status: 'Active',
    startDate: '2020-11-12',
  },
  {
    id: 6,
    name: 'David Park',
    email: 'david.p@company.com',
    phone: '+1 (555) 678-9012',
    department: 'Finance',
    position: 'Financial Analyst',
    status: 'Active',
    startDate: '2023-01-08',
  },
];

export function EmployeesSection() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl mb-2">Employees</h2>
          <p className="text-slate-600">Manage your team members and their information</p>
        </div>
        <AddEmployeeDialog />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search employees by name, email, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                          {getInitials(employee.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{employee.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-600">{employee.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-600">{employee.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.startDate}</TableCell>
                  <TableCell>
                    <Badge
                      variant={employee.status === 'Active' ? 'default' : 'secondary'}
                      className={
                        employee.status === 'Active'
                          ? 'bg-green-100 text-green-700 hover:bg-green-100'
                          : ''
                      }
                    >
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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