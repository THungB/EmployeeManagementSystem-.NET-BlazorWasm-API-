import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { EmployeesSection } from './EmployeesSection';
import { VacationSection } from './VacationSection';
import { OvertimeSection } from './OvertimeSection';
import { DoctorSection } from './DoctorSection';
import { SanctionsSection } from './SanctionsSection';
import { DepartmentsSection } from './DepartmentsSection';
import { QueriesSection } from './QueriesSection';
import { User } from '../App';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';

interface ManagerDashboardProps {
  user: User;
  onLogout: () => void;
}

export function ManagerDashboard({ user, onLogout }: ManagerDashboardProps) {
  const [activeSection, setActiveSection] = useState('employees');

  const renderSection = () => {
    switch (activeSection) {
      case 'employees':
        return <EmployeesSection />;
      case 'vacation':
        return <VacationSection />;
      case 'overtime':
        return <OvertimeSection />;
      case 'doctor':
        return <DoctorSection />;
      case 'sanctions':
        return <SanctionsSection />;
      case 'departments':
        return <DepartmentsSection />;
      case 'queries':
        return <QueriesSection />;
      default:
        return <EmployeesSection />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} userRole="manager" />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-sm text-slate-600">Welcome back,</p>
              <h1 className="text-2xl">{user.name}</h1>
            </div>
            <Button variant="outline" onClick={onLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
          {renderSection()}
        </div>
      </main>
    </div>
  );
}
