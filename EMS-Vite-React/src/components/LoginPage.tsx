import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { User } from '../App';
import { Building2, LogIn, UserPlus } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

// Mock users database
const mockUsers: User[] = [
  {
    id: 1,
    email: 'manager@company.com',
    name: 'Admin Manager',
    role: 'manager',
  },
  {
    id: 2,
    email: 'sarah.j@company.com',
    name: 'Sarah Johnson',
    role: 'employee',
    employeeData: {
      dob: '1990-05-15',
      branch: 'Main Office',
      department: 'Engineering',
      city: 'New York',
      position: 'Senior Developer',
      phone: '+1 (555) 123-4567',
      startDate: '2022-01-15',
    },
  },
];

export function LoginPage({ onLogin }: LoginPageProps) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    dob: '',
    branch: '',
    department: '',
    city: '',
    phone: '',
  });
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = mockUsers.find((u) => u.email === loginEmail);
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid email or password');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!registerData.name || !registerData.email || !registerData.password) {
      setError('Please fill in all required fields');
      return;
    }

    // Check if email already exists
    if (mockUsers.find((u) => u.email === registerData.email)) {
      setError('Email already registered');
      return;
    }

    // Create new employee user
    const newUser: User = {
      id: mockUsers.length + 1,
      email: registerData.email,
      name: registerData.name,
      role: 'employee',
      employeeData: {
        dob: registerData.dob,
        branch: registerData.branch,
        department: registerData.department,
        city: registerData.city,
        phone: registerData.phone,
        position: 'New Employee',
        startDate: new Date().toISOString().split('T')[0],
      },
    };

    mockUsers.push(newUser);
    onLogin(newUser);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-purple-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl text-white mb-2">Employee Portal</h1>
          <p className="text-purple-200">Management System</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Login or register to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your.email@company.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <Button type="submit" className="w-full gap-2">
                    <LogIn className="w-4 h-4" />
                    Login
                  </Button>

                  <div className="mt-4 p-4 bg-slate-50 rounded-lg space-y-2 text-sm">
                    <p className="font-medium">Demo Accounts:</p>
                    <p className="text-slate-600">
                      <strong>Manager:</strong> manager@company.com
                    </p>
                    <p className="text-slate-600">
                      <strong>Employee:</strong> sarah.j@company.com
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                      (Any password works for demo)
                    </p>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full Name *</Label>
                    <Input
                      id="register-name"
                      placeholder="John Doe"
                      value={registerData.name}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email *</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="john.doe@company.com"
                      value={registerData.email}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password *</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Create a password"
                      value={registerData.password}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, password: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-dob">Date of Birth</Label>
                    <Input
                      id="register-dob"
                      type="date"
                      value={registerData.dob}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, dob: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-phone">Phone</Label>
                    <Input
                      id="register-phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={registerData.phone}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-department">Department</Label>
                    <Input
                      id="register-department"
                      placeholder="Engineering"
                      value={registerData.department}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, department: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-city">City</Label>
                    <Input
                      id="register-city"
                      placeholder="New York"
                      value={registerData.city}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, city: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-branch">Branch</Label>
                    <Input
                      id="register-branch"
                      placeholder="Main Office"
                      value={registerData.branch}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, branch: e.target.value })
                      }
                    />
                  </div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <Button type="submit" className="w-full gap-2">
                    <UserPlus className="w-4 h-4" />
                    Register as Employee
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
