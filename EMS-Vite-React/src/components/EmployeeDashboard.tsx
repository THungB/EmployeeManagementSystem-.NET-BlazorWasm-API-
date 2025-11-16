import { useState } from 'react';
import { User } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { LogOut, MessageSquare, Calendar as CalendarIcon, ListTodo, HelpCircle, Bell, LayoutDashboard, UserPen } from 'lucide-react';
import { EmployeeProfileEdit } from './EmployeeProfileEdit';
import { EmployeeQuerySection } from './EmployeeQuerySection';
import { EmployeeCalendar } from './EmployeeCalendar';
import { EmployeeTodoList } from './EmployeeTodoList';
import { EmployeeSupport } from './EmployeeSupport';
import { NotificationsPanel } from './NotificationsPanel';
import { Badge } from './ui/badge';

interface EmployeeDashboardProps {
  user: User;
  onLogout: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'edit', label: 'Edit Profile', icon: UserPen },
  { id: 'queries', label: 'Queries', icon: MessageSquare },
  { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
  { id: 'todo', label: 'To-Do List', icon: ListTodo },
  { id: 'support', label: 'Support', icon: HelpCircle },
];

export function EmployeeDashboard({ user, onLogout }: EmployeeDashboardProps) {
  const [activeView, setActiveView] = useState<'dashboard' | 'edit' | 'queries' | 'calendar' | 'todo' | 'support'>('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount] = useState(3); // Mock unread count

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const renderContent = () => {
    if (activeView === 'edit') {
      return (
        <div className="container mx-auto p-8 max-w-4xl">
          <EmployeeProfileEdit user={user} onBack={() => setActiveView('dashboard')} />
        </div>
      );
    }

    if (activeView === 'queries') {
      return <EmployeeQuerySection user={user} />;
    }

    if (activeView === 'calendar') {
      return <EmployeeCalendar user={user} />;
    }

    if (activeView === 'todo') {
      return <EmployeeTodoList user={user} />;
    }

    if (activeView === 'support') {
      return <EmployeeSupport user={user} />;
    }

    // Dashboard view
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>My Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-2xl">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl mb-1">{user.name}</h3>
                <p className="text-sm text-slate-600 mb-4">
                  {user.employeeData?.position || 'Employee'}
                </p>
                <Button onClick={() => setActiveView('edit')} className="w-full gap-2">
                  Edit Profile
                </Button>
              </div>

              <div className="pt-4 border-t space-y-3">
                <div>
                  <p className="text-sm text-slate-600">Email</p>
                  <p>{user.email}</p>
                </div>
                {user.employeeData && (
                  <>
                    <div>
                      <p className="text-sm text-slate-600">Phone</p>
                      <p>{user.employeeData.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Department</p>
                      <p>{user.employeeData.department}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Branch</p>
                      <p>{user.employeeData.branch}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">City</p>
                      <p>{user.employeeData.city}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Date of Birth</p>
                      <p>{user.employeeData.dob}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Start Date</p>
                      <p>{user.employeeData.startDate}</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overview Cards */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-slate-600 mb-1">Pending Queries</p>
                  <p className="text-2xl">2</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-slate-600 mb-1">Tasks Due</p>
                  <p className="text-2xl">5</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-slate-600 mb-1">Upcoming Events</p>
                  <p className="text-2xl">3</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-slate-600 mb-1">Notifications</p>
                  <p className="text-2xl">{unreadCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                  <div className="flex-1">
                    <p className="text-sm">Overtime request approved</p>
                    <p className="text-xs text-slate-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                  <div className="flex-1">
                    <p className="text-sm">New task assigned: Q4 Report</p>
                    <p className="text-xs text-slate-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2" />
                  <div className="flex-1">
                    <p className="text-sm">Vacation request pending review</p>
                    <p className="text-xs text-slate-500">2 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-indigo-900 via-purple-900 to-purple-950 text-white p-6 shadow-2xl">
        <div className="mb-12">
          <h1 className="text-2xl mb-1">Employee Portal</h1>
          <p className="text-purple-200 text-sm">{user.name}</p>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-white/20 backdrop-blur-sm shadow-lg scale-105'
                    : 'hover:bg-white/10 hover:translate-x-1'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-yellow-300' : 'text-purple-200'}`} />
                <span className={isActive ? '' : 'text-purple-100'}>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl">
                {menuItems.find(item => item.id === activeView)?.label || 'My Profile'}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
                {showNotifications && (
                  <NotificationsPanel onClose={() => setShowNotifications(false)} />
                )}
              </div>
              <Button variant="outline" onClick={onLogout} className="gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>

          {/* Content */}
          {renderContent()}
        </div>
      </main>
    </div>
  );
}