
import React from 'react';
// TaskProvider is no longer needed here, it's in App.tsx
import { AddTaskForm } from '@/components/AddTaskForm';
import { TaskList } from '@/components/TaskList';
// We might want to use useTask here for loading/error states related to fetching tasks
// import { useTask } from '@/contexts/TaskContext'; 

const Index = () => {
  // const { isLoading, error } = useTask(); // Example if we want to show global loading/error here

  // if (isLoading) return <p>Loading tasks...</p>; // Handled by TaskContext for now
  // if (error) return <p>Error loading tasks: {error}</p>; // Handled by TaskContext

  return (
    // <TaskProvider> // REMOVE THIS WRAPPER
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Sistema de Gerenciamento de Tarefas
            </h1>
            <p className="text-lg text-gray-600">
              Organize suas tarefas de forma simples e eficiente
            </p>
          </header>
          
          <div className="space-y-8">
            <AddTaskForm />
            <TaskList />
          </div>
        </div>
      </div>
    // </TaskProvider> // REMOVE THIS WRAPPER
  );
};

export default Index;
