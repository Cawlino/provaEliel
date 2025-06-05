import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, TaskStatus } from '@/types/task';

const API_BASE_URL = 'http://localhost:3000';

interface AuthResponse {
  token: string;
  // Add other user details if returned by your backend
  // userId: string;
  // username: string;
}

interface TaskContextType {
  tasks: Task[];
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean; // To handle loading states for API calls
  error: string | null; // To display API errors
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>; // Corrected: email not needed
  logout: () => void;
  addTask: (title: string, description: string, status?: TaskStatus) => Promise<void>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTask: (id: string, title: string, description: string) => Promise<void>;
  moveTask: (taskId: string, newStatus: TaskStatus, newIndex: number) => void; // Will adjust later
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider = ({ children }: TaskProviderProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const fetchTasks = async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || `Failed to fetch tasks: ${response.statusText}`);
      }
      const data: any[] = await response.json();
      // Backend uses _id, frontend uses id. Also, ensure date strings are converted to Date objects.
      const formattedTasks: Task[] = data.map(task => ({
        ...task,
        id: task._id, // Map _id to id
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
      }));
      setTasks(formattedTasks);
    } catch (err: any) {
      setError(err.message);
      console.error("Failed to fetch tasks:", err);
      // If token is invalid (e.g., 401), logout user
      if (err.message.includes('401') || err.message.toLowerCase().includes('unauthorized')) {
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchTasks();
    } else {
      setTasks([]); // Clear tasks if not authenticated
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, token]);


  const register = async (username: string, password: string) => { // Corrected: removed email parameter
    setIsLoading(true);
    setError(null);
    try {
      // Backend register expects username, password
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }), // Corrected: removed email field
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || `Registration failed: ${response.statusText}`);
      }
      // Optionally, log in the user directly after registration or prompt them to log in
      // For now, just clear error. User will need to login separately.
      console.log('Registration successful');
    } catch (err: any) {
      setError(err.message);
      console.error("Registration failed:", err);
      throw err; // Re-throw to be caught by UI
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (usernameOrEmail: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Backend auth.controller.js likely uses 'username' or 'email' and 'password'
      // For now, assuming 'username' is the primary identifier for login as per task description
      const payload = { username: usernameOrEmail, password }; // Adjust if backend uses email for login

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || `Login failed: ${response.statusText}`);
      }
      const data: AuthResponse = await response.json();
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        setToken(data.token);
        setIsAuthenticated(true);
      } else {
        throw new Error('Login bem-sucedido, mas nenhum token foi recebido.'); // Translated
      }
    } catch (err: any) {
      setError(err.message);
      setIsAuthenticated(false);
      console.error("Login failed:", err);
      throw err; // Re-throw to be caught by UI
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setIsAuthenticated(false);
    setTasks([]); // Clear tasks on logout
  };

  const addTask = async (title: string, description: string, status: TaskStatus = 'pending') => {
    if (!token) {
      setError("Não autenticado. Por favor, faça o login."); // Translated
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, status }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || `Failed to add task: ${response.statusText}`);
      }
      const newTaskData = await response.json();
      const newTask: Task = {
        ...newTaskData,
        id: newTaskData._id, // Map _id
        createdAt: new Date(newTaskData.createdAt),
        updatedAt: new Date(newTaskData.updatedAt),
      };
      setTasks(prev => [...prev, newTask]);
    } catch (err: any) {
      setError(err.message);
      console.error("Failed to add task:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTaskStatus = async (id: string, status: TaskStatus) => {
    if (!token) {
      setError("Não autenticado. Por favor, faça o login."); // Translated
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, { // Assuming id is _id
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }), // Only send status for status update
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || `Failed to update task status: ${response.statusText}`);
      }
      const updatedTaskData = await response.json();
      const updatedTask: Task = {
        ...updatedTaskData,
        id: updatedTaskData._id,
        createdAt: new Date(updatedTaskData.createdAt),
        updatedAt: new Date(updatedTaskData.updatedAt),
      };
      setTasks(prev => 
        prev.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        )
      );
    } catch (err: any) {
      setError(err.message);
      console.error("Failed to update task status:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (id: string, title: string, description: string) => {
    if (!token) {
      setError("Não autenticado. Por favor, faça o login."); // Translated
      return;
    }
    setIsLoading(true);
    setError(null);
    // Find current status to send it along, as PUT might expect full task or specific fields
    // The backend PUT /:id in task.controller.js likely updates only provided fields.
    // Let's assume we only send title and description for this specific update function.
    // If status also needs to be preserved or sent, it should be included.
    const taskToUpdate = tasks.find(t => t.id === id);
    if (!taskToUpdate) {
        setError("Task not found for update.");
        setIsLoading(false);
        return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, { // Assuming id is _id
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, status: taskToUpdate.status }), // Send current status
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || `Failed to update task: ${response.statusText}`);
      }
      const updatedTaskData = await response.json();
      const updatedTask: Task = {
        ...updatedTaskData,
        id: updatedTaskData._id,
        createdAt: new Date(updatedTaskData.createdAt),
        updatedAt: new Date(updatedTaskData.updatedAt),
      };
      setTasks(prev => 
        prev.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        )
      );
    } catch (err: any) {
      setError(err.message);
      console.error("Failed to update task:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    if (!token) {
      setError("Não autenticado. Por favor, faça o login."); // Translated
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, { // Assuming id is _id
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || `Failed to delete task: ${response.statusText}`);
      }
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err: any) {
      setError(err.message);
      console.error("Failed to delete task:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // moveTask is more complex with backend. For now, it updates status and relies on frontend for order.
  // A proper backend implementation might involve an 'order' field.
  // This simplified version will just update the status via backend if status changes.
  const moveTask = (taskId: string, newStatus: TaskStatus, newIndex: number) => {
    const taskToMove = tasks.find(task => task.id === taskId);
    if (taskToMove && taskToMove.status !== newStatus) {
      updateTaskStatus(taskId, newStatus); // This will call backend and update local state
    } else {
      // Purely frontend reorder if status doesn't change, or if updateTaskStatus handles re-fetch/update
      // For simplicity, if status is the same, this reorder is client-side only.
      // A more robust solution would ensure backend consistency or a specific reorder endpoint.
      setTasks(prev => {
        const task = prev.find(t => t.id === taskId);
        if (!task) return prev;
        const updatedTask = { ...task, status: newStatus, updatedAt: new Date() }; // Local update for visual
        const otherTasks = prev.filter(t => t.id !== taskId);
        const tasksInNewStatus = otherTasks.filter(t => t.status === newStatus);
        
        tasksInNewStatus.splice(newIndex, 0, updatedTask);
        const tasksInOtherStatuses = otherTasks.filter(t => t.status !== newStatus);
        
        return [...tasksInOtherStatuses, ...tasksInNewStatus].sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); // Basic sort
      });
    }
    console.log('Task moved (client-side reorder may apply):', taskId, 'to', newStatus, 'at index', newIndex);
  };


  return (
    <TaskContext.Provider 
      value={{ 
        tasks, 
        token,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout,
        addTask, 
        updateTaskStatus, 
        deleteTask, 
        updateTask,
        moveTask 
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
