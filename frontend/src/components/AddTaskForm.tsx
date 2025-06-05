
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTask } from '@/contexts/TaskContext';
import { toast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

export const AddTaskForm = () => {
  const [title, setTitle] = useState('');
  const { addTask, isLoading, error: contextError } = useTask(); // Get isLoading and error

  const handleSubmit = async (e: React.FormEvent) => { // Make handleSubmit async
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Erro",
        description: "O título da tarefa é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    try {
      await addTask(title.trim(), ''); // Await addTask, pass empty description
      setTitle('');
      toast({
        title: "Sucesso!",
        description: "Tarefa adicionada com sucesso.",
      });
    } catch (err: any) {
      toast({
        title: "Erro ao adicionar tarefa",
        description: err.message || contextError || "Ocorreu um problema.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          placeholder="Digite sua tarefa..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 h-12 text-lg"
          autoFocus
          disabled={isLoading} // Disable input when loading
        />
        <Button 
          type="submit" 
          className="h-12 px-6 bg-blue-600 hover:bg-blue-700"
          disabled={isLoading} // Disable button when loading
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adicionando...
            </>
          ) : (
            <>
              <Plus className="h-5 w-5 mr-2" />
              Adicionar
            </>
          )}
        </Button>
      </form>
      {contextError && <p className="text-sm text-red-600 mt-2 text-center">{contextError}</p>}
    </div>
  );
};
