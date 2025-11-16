import { useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { ManagerDashboard } from "./components/ManagerDashboard";
import { EmployeeDashboard } from "./components/EmployeeDashboard";
import { Toaster } from "./components/ui/sonner";

export type UserRole = "employee" | "manager" | null;

export interface User {
  id: number;
  email: string;
  name: string;
  role: "employee" | "manager";
  employeeData?: {
    dob: string;
    branch: string;
    department: string;
    city: string;
    photo?: string;
    position: string;
    phone: string;
    startDate: string;
  };
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(
    null,
  );

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <>
      {!currentUser && <LoginPage onLogin={handleLogin} />}
      {currentUser?.role === "manager" && (
        <ManagerDashboard
          user={currentUser}
          onLogout={handleLogout}
        />
      )}
      {currentUser?.role === "employee" && (
        <EmployeeDashboard
          user={currentUser}
          onLogout={handleLogout}
        />
      )}
      <Toaster />
    </>
  );
}