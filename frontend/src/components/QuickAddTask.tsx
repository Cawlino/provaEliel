
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import { useTask } from '@/contexts/TaskContext';
import { TaskStatus } from '@/types/task';
import { toast } from '@/hooks/use-toast';

interface QuickAddTaskProps {
  status: TaskStatus;
}

export const QuickAddTask = ({ status }: QuickAddTaskProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const { addTask, isLoading, error: contextError } = useTask(); // Get isLoading and error

  const handleSubmit = async (e: React.FormEvent) => { // Make async
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
      await addTask(title.trim(), '', status); // Await addTask
      setTitle('');
      setIsAdding(false); // Close form on success
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
      // Optionally keep the form open on error, or setIsAdding(false) depending on desired UX
    }
  };

  const handleCancel = () => {
    setTitle('');
    setIsAdding(false);
  };

  if (!isAdding) {
    return (
      <Button
        onClick={() => setIsAdding(true)}
        variant="ghost"
        className="w-full justify-start text-gray-500 hover:text-gray-700"
      >
        <Plus className="h-4 w-4 mr-2" />
        Adicionar tarefa
      </Button>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-3">
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input
            type="text"
            placeholder="Digite o título da tarefa..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full"
            autoFocus
            disabled={isLoading} // Disable input when loading
          />
          <div className="flex gap-2">
            <Button 
              type="submit" 
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isLoading} // Disable button when loading
            >
              {isLoading ? 'Adicionando...' : 'Adicionar'}
            </Button>
            <Button 
              type="button"
              onClick={handleCancel}
              variant="ghost"
              size="sm"
              disabled={isLoading} // Disable cancel when loading
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {contextError && <p className="text-xs text-red-600 mt-1">{contextError}</p>}
        </form>
      </CardContent>
    </Card>
  );
};
