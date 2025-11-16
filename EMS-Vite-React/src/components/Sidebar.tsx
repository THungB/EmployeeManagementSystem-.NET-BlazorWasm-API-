import { Users, Plane, Clock, Stethoscope, AlertTriangle, Building2, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  userRole?: 'employee' | 'manager';
}

const menuItems = [
  { id: 'employees', label: 'Employees', icon: Users },
  { id: 'vacation', label: 'Vacation', icon: Plane },
  { id: 'overtime', label: 'Overtime', icon: Clock },
  { id: 'doctor', label: 'Doctor', icon: Stethoscope },
  { id: 'sanctions', label: 'Sanctions', icon: AlertTriangle },
  { id: 'departments', label: 'Departments', icon: Building2 },
  { id: 'queries', label: 'Queries', icon: MessageSquare },
];

export function Sidebar({ activeSection, setActiveSection, userRole = 'manager' }: SidebarProps) {
  return (
    <aside className="w-64 bg-gradient-to-b from-indigo-900 via-purple-900 to-purple-950 text-white p-6 shadow-2xl">
      <div className="mb-12">
        <h1 className="text-2xl mb-1">Employee Portal</h1>
        <p className="text-purple-200 text-sm">Management System</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
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
  );
}