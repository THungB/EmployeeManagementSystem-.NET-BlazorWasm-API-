import { useState } from 'react';
import { User } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';

interface EmployeeCalendarProps {
  user: User;
}

interface Event {
  id: number;
  title: string;
  date: string;
  type: 'deadline' | 'meeting' | 'event' | 'task';
  description?: string;
}

const events: Event[] = [
  {
    id: 1,
    title: 'Q4 Report Deadline',
    date: '20/11/2025',
    type: 'deadline',
    description: 'Submit quarterly financial report',
  },
  {
    id: 2,
    title: 'Team Meeting',
    date: '18/11/2025',
    type: 'meeting',
    description: 'Weekly team sync-up',
  },
  {
    id: 3,
    title: 'Project Review',
    date: '25/11/2025',
    type: 'event',
    description: 'Client project presentation',
  },
  {
    id: 4,
    title: 'Training Session',
    date: '22/11/2025',
    type: 'event',
    description: 'New software training',
  },
];

export function EmployeeCalendar({ user }: EmployeeCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (day: number) => {
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();
    return `${String(day).padStart(2, '0')}/${month}/${year}`;
  };

  const getEventsForDate = (dateStr: string) => {
    return events.filter(event => event.date === dateStr);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deadline':
        return 'bg-red-100 text-red-700 hover:bg-red-100';
      case 'meeting':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
      case 'event':
        return 'bg-purple-100 text-purple-700 hover:bg-purple-100';
      case 'task':
        return 'bg-green-100 text-green-700 hover:bg-green-100';
      default:
        return '';
    }
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="p-2" />);
  }

  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDate(day);
    const dayEvents = getEventsForDate(dateStr);
    const isToday = new Date().getDate() === day && 
                    new Date().getMonth() === currentDate.getMonth() &&
                    new Date().getFullYear() === currentDate.getFullYear();

    days.push(
      <div
        key={day}
        className={`p-2 border rounded-lg min-h-[80px] cursor-pointer transition-colors ${
          isToday ? 'bg-blue-50 border-blue-300' : 'hover:bg-slate-50'
        }`}
        onClick={() => setSelectedDate(dateStr)}
      >
        <div className={`text-sm mb-1 ${isToday ? 'font-bold text-blue-600' : ''}`}>
          {day}
        </div>
        <div className="space-y-1">
          {dayEvents.slice(0, 2).map(event => (
            <div
              key={event.id}
              className={`text-xs p-1 rounded truncate ${getTypeColor(event.type)}`}
            >
              {event.title}
            </div>
          ))}
          {dayEvents.length > 2 && (
            <div className="text-xs text-slate-500">+{dayEvents.length - 2} more</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-slate-600">Track deadlines and important dates</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
              <DialogDescription>
                Create a new event or deadline in your calendar
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Event Title</Label>
                <Input placeholder="Enter event title" />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Event details..." rows={3} />
              </div>
              <Button
                onClick={() => {
                  toast('Event added successfully!');
                  setOpen(false);
                }}
                className="w-full"
              >
                Add Event
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={previousMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-medium text-sm text-slate-600 p-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {days}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events.map(event => (
              <div key={event.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{event.title}</h4>
                    <Badge className={getTypeColor(event.type)}>{event.type}</Badge>
                  </div>
                  <p className="text-sm text-slate-600">{event.description}</p>
                  <p className="text-xs text-slate-500 mt-1">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
