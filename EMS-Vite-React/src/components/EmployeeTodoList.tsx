import { useState } from 'react';
import { User } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface EmployeeTodoListProps {
  user: User;
}

interface TodoItem {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
}

const initialTodos: TodoItem[] = [
  {
    id: 1,
    title: 'Complete Q4 Financial Report',
    description: 'Prepare and submit quarterly report',
    completed: false,
    priority: 'high',
    dueDate: '20/11/2025',
  },
  {
    id: 2,
    title: 'Review Client Proposal',
    description: 'Review and provide feedback on new client proposal',
    completed: false,
    priority: 'medium',
    dueDate: '18/11/2025',
  },
  {
    id: 3,
    title: 'Update Project Documentation',
    description: 'Update technical documentation for Project X',
    completed: true,
    priority: 'low',
    dueDate: '15/11/2025',
  },
  {
    id: 4,
    title: 'Attend Team Meeting',
    description: 'Weekly team sync-up meeting',
    completed: false,
    priority: 'medium',
    dueDate: '18/11/2025',
  },
  {
    id: 5,
    title: 'Code Review',
    description: 'Review pull requests from team members',
    completed: false,
    priority: 'high',
    dueDate: '17/11/2025',
  },
];

export function EmployeeTodoList({ user }: EmployeeTodoListProps) {
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);
  const [showCompleted, setShowCompleted] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  
  // Form state
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    dueDate: '',
  });

  const addTodo = () => {
    if (!newTodo.title.trim()) {
      toast('Please enter a task', {
        description: 'Task title cannot be empty.',
      });
      return;
    }

    if (!newTodo.dueDate) {
      toast('Please select a due date', {
        description: 'Due date is required.',
      });
      return;
    }

    // Convert date from YYYY-MM-DD to DD/MM/YYYY
    const [year, month, day] = newTodo.dueDate.split('-');
    const formattedDate = `${day}/${month}/${year}`;

    const todo: TodoItem = {
      id: Date.now(),
      title: newTodo.title,
      description: newTodo.description,
      completed: false,
      priority: newTodo.priority,
      dueDate: formattedDate,
    };

    setTodos([todo, ...todos]);
    setNewTodo({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
    });
    setShowDialog(false);
    toast('Task added successfully!');
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const confirmDelete = (id: number) => {
    setDeleteId(id);
  };

  const deleteTodo = () => {
    if (deleteId !== null) {
      setTodos(todos.filter(todo => todo.id !== deleteId));
      toast('Task deleted successfully');
      setDeleteId(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 hover:bg-red-100';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
      case 'low':
        return 'bg-green-100 text-green-700 hover:bg-green-100';
      default:
        return '';
    }
  };

  const filteredTodos = showCompleted
    ? todos
    : todos.filter(todo => !todo.completed);

  const completedCount = todos.filter(t => t.completed).length;
  const pendingCount = todos.filter(t => !t.completed).length;
  const highPriorityCount = todos.filter(t => !t.completed && t.priority === 'high').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-slate-600">Manage your tasks and to-do items</p>
        <Button
          variant="outline"
          onClick={() => setShowCompleted(!showCompleted)}
        >
          {showCompleted ? 'Hide' : 'Show'} Completed
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl mb-2">{pendingCount}</div>
              <p className="text-sm text-slate-600">Pending Tasks</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl mb-2">{completedCount}</div>
              <p className="text-sm text-slate-600">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl mb-2 text-red-600">{highPriorityCount}</div>
              <p className="text-sm text-slate-600">High Priority</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Add New Task</CardTitle>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <Button onClick={() => setShowDialog(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Task
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>
                  Add a new task to your to-do list with priority and due date.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="task-title">Task Title *</Label>
                  <Input
                    id="task-title"
                    placeholder="Enter task title..."
                    value={newTodo.title}
                    onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task-description">Description</Label>
                  <Input
                    id="task-description"
                    placeholder="Add details about the task..."
                    value={newTodo.description}
                    onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task-duedate">Due Date *</Label>
                  <Input
                    id="task-duedate"
                    type="date"
                    value={newTodo.dueDate}
                    onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Priority *</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={newTodo.priority === 'low' ? 'default' : 'outline'}
                      onClick={() => setNewTodo({ ...newTodo, priority: 'low' })}
                      className="flex-1"
                    >
                      Low
                    </Button>
                    <Button
                      type="button"
                      variant={newTodo.priority === 'medium' ? 'default' : 'outline'}
                      onClick={() => setNewTodo({ ...newTodo, priority: 'medium' })}
                      className="flex-1"
                    >
                      Medium
                    </Button>
                    <Button
                      type="button"
                      variant={newTodo.priority === 'high' ? 'default' : 'outline'}
                      onClick={() => setNewTodo({ ...newTodo, priority: 'high' })}
                      className="flex-1"
                    >
                      High
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={addTodo} className="flex-1">
                    Add Task
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowDialog(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredTodos.length === 0 ? (
              <p className="text-center text-slate-500 py-8">No tasks to display</p>
            ) : (
              filteredTodos.map(todo => (
                <div
                  key={todo.id}
                  className={`flex items-start gap-3 p-4 border rounded-lg transition-colors ${
                    todo.completed ? 'bg-slate-50' : 'bg-white'
                  }`}
                >
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4
                        className={`font-medium ${
                          todo.completed ? 'line-through text-slate-500' : ''
                        }`}
                      >
                        {todo.title}
                      </h4>
                      <Badge className={getPriorityColor(todo.priority)}>
                        {todo.priority}
                      </Badge>
                    </div>
                    {todo.description && (
                      <p className="text-sm text-slate-600">{todo.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-slate-500">Due: {todo.dueDate}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => confirmDelete(todo.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteTodo} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
