
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Task, TaskStatus } from '@/types/task';
import { useTask } from '@/contexts/TaskContext';
import { Trash, Check, Move, Loader2 } from 'lucide-react'; // Added Loader2
import { toast } from '@/hooks/use-toast';

interface TaskCardProps {
  task: Task;
}

export const TaskCard = ({ task }: TaskCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  // Get isLoading and error for specific card actions if needed, or use global isLoading
  const { deleteTask, updateTask, isLoading: isContextLoading, error: contextError } = useTask(); 
  const [isCardLoading, setIsCardLoading] = useState(false); // Local loading state for card-specific actions

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'in progress': // Corrected status key
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Em Progresso</Badge>;
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Concluída</Badge>;
    }
  };

  const handleDelete = async () => { // Make async
    setIsCardLoading(true);
    try {
      await deleteTask(task.id);
      toast({
        title: "Tarefa removida",
        description: "A tarefa foi removida com sucesso.",
      });
      // No need to setIsEditing(false) as the card will be removed
    } catch (err: any) {
      toast({
        title: "Erro ao remover tarefa",
        description: err.message || contextError || "Ocorreu um problema.",
        variant: "destructive",
      });
    } finally {
      setIsCardLoading(false);
    }
  };

  const handleSaveEdit = async () => { // Make async
    if (!editTitle.trim()) {
      toast({
        title: "Erro",
        description: "O título da tarefa é obrigatório.",
        variant: "destructive",
      });
      return;
    }
    setIsCardLoading(true);
    try {
      await updateTask(task.id, editTitle.trim(), editDescription.trim());
      setIsEditing(false);
      toast({
        title: "Tarefa atualizada",
        description: "As informações da tarefa foram atualizadas.",
      });
    } catch (err: any) {
      toast({
        title: "Erro ao atualizar tarefa",
        description: err.message || contextError || "Ocorreu um problema.",
        variant: "destructive",
      });
    } finally {
      setIsCardLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setIsEditing(false);
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-300 cursor-grab active:cursor-grabbing">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          {isEditing ? (
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="text-lg font-semibold"
            />
          ) : (
            <h3 
              className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-blue-600"
              onClick={() => setIsEditing(true)}
            >
              {task.title}
            </h3>
          )}
          <div className="flex gap-2 items-center">
            <Move className="h-4 w-4 text-gray-400" />
            {getStatusBadge(task.status)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <Textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Descrição da tarefa"
            className="min-h-[60px]"
          />
        ) : (
          task.description && (
            <p 
              className="text-gray-600 cursor-pointer hover:text-gray-800"
              onClick={() => setIsEditing(true)}
            >
              {task.description}
            </p>
          )
        )}
        
        <div className="flex justify-between items-center">
          {isEditing ? (
            <div className="flex gap-2">
              <Button 
                onClick={handleSaveEdit}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                disabled={isCardLoading || isContextLoading}
              >
                {isCardLoading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
                Salvar
              </Button>
              <Button 
                onClick={handleCancelEdit}
                variant="outline"
                size="sm"
                disabled={isCardLoading || isContextLoading}
              >
                Cancelar
              </Button>
            </div>
          ) : (
            <Button 
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
              disabled={isCardLoading || isContextLoading}
            >
              Editar
            </Button>
          )}
          
          <Button 
            onClick={handleDelete}
            variant="destructive"
            size="sm"
            disabled={isCardLoading || isContextLoading}
          >
            {isCardLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
          </Button>
        </div>
        {/* Display context error if relevant to this card, or rely on global error display */}
        {/* contextError && <p className="text-xs text-red-500">{contextError}</p> */}
        <div className="text-xs text-gray-400 pt-2 border-t">
          Criada em: {task.createdAt.toLocaleDateString('pt-BR')} às {task.createdAt.toLocaleTimeString('pt-BR')}
        </div>
      </CardContent>
    </Card>
  );
};
