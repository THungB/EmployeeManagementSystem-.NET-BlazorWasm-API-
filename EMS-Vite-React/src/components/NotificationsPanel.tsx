import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, Clock, MessageSquare, ListTodo } from 'lucide-react';
import { Button } from './ui/button';

interface NotificationsPanelProps {
  onClose: () => void;
}

const notifications = [
  {
    id: 1,
    type: 'query',
    title: 'Overtime Request Approved',
    message: 'Your overtime request for 3 hours has been approved by your manager.',
    time: '2 hours ago',
    read: false,
    icon: CheckCircle,
    color: 'text-green-600',
  },
  {
    id: 2,
    type: 'task',
    title: 'New Task Assigned',
    message: 'You have been assigned to work on the Q4 Financial Report.',
    time: '1 day ago',
    read: false,
    icon: ListTodo,
    color: 'text-blue-600',
  },
  {
    id: 3,
    type: 'query',
    title: 'Vacation Request Pending',
    message: 'Your vacation request is awaiting manager approval.',
    time: '2 days ago',
    read: false,
    icon: Clock,
    color: 'text-yellow-600',
  },
  {
    id: 4,
    type: 'message',
    title: 'Manager Response',
    message: 'You received a response to your health insurance query.',
    time: '3 days ago',
    read: true,
    icon: MessageSquare,
    color: 'text-purple-600',
  },
];

export function NotificationsPanel({ onClose }: NotificationsPanelProps) {
  return (
    <Card className="absolute right-0 top-12 w-96 max-h-[500px] overflow-y-auto shadow-xl z-50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg">Notifications</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {notifications.map((notification) => {
          const Icon = notification.icon;
          return (
            <div
              key={notification.id}
              className={`p-3 rounded-lg border transition-colors ${
                notification.read ? 'bg-slate-50' : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 mt-0.5 ${notification.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-sm">{notification.title}</p>
                    {!notification.read && (
                      <Badge className="bg-blue-500 h-2 w-2 p-0 rounded-full" />
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-slate-500 mt-2">{notification.time}</p>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
