import { Building2, Users, TrendingUp, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const departments = [
  {
    id: 1,
    name: 'Engineering',
    manager: 'Sarah Johnson',
    employees: 15,
    budget: '$450,000',
    growth: '+12%',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 2,
    name: 'Marketing',
    manager: 'Michael Chen',
    employees: 8,
    budget: '$280,000',
    growth: '+8%',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 3,
    name: 'Human Resources',
    manager: 'Emily Rodriguez',
    employees: 5,
    budget: '$180,000',
    growth: '+5%',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 4,
    name: 'Sales',
    manager: 'Lisa Anderson',
    employees: 12,
    budget: '$380,000',
    growth: '+15%',
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 5,
    name: 'Finance',
    manager: 'David Park',
    employees: 6,
    budget: '$220,000',
    growth: '+3%',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    id: 6,
    name: 'Operations',
    manager: 'James Wilson',
    employees: 10,
    budget: '$320,000',
    growth: '+10%',
    color: 'from-teal-500 to-cyan-500',
  },
];

export function DepartmentsSection() {
  const totalEmployees = departments.reduce((sum, dept) => sum + dept.employees, 0);
  const totalDepartments = departments.length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl mb-2">Departments</h2>
        <p className="text-slate-600">Overview of all company departments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Departments</CardTitle>
            <Building2 className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalDepartments}</div>
            <p className="text-xs text-slate-600 mt-1">Active departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalEmployees}</div>
            <p className="text-xs text-slate-600 mt-1">Across all departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Avg Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">+8.8%</div>
            <p className="text-xs text-slate-600 mt-1">Year over year</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <Card key={dept.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className={`h-2 bg-gradient-to-r ${dept.color}`} />
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{dept.name}</CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${dept.color}`}>
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-600">Department Manager</p>
                <p className="mt-1">{dept.manager}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600">Employees</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>{dept.employees}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Budget</p>
                  <p className="mt-1">{dept.budget}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-sm text-slate-600">Growth</span>
                <span className="text-green-600">{dept.growth}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
