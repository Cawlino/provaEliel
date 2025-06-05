
import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { TaskCard } from './TaskCard';
import { QuickAddTask } from './QuickAddTask';
import { useTask } from '@/contexts/TaskContext';
import { TaskStatus } from '@/types/task';
import { List, Loader2 } from 'lucide-react'; // Added Loader2

export const TaskList = () => {
  const { tasks, moveTask, isLoading, error, updateTaskStatus, deleteTask, updateTask } = useTask(); // Added isLoading, error and action functions

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  const statusLabels = {
    pending: 'Pendentes',
    'in progress': 'Em Progresso', // Corrected key
    completed: 'Concluídas'
  };

  const statusColors = {
    pending: 'border-yellow-200 bg-yellow-50',
    'in progress': 'border-blue-200 bg-blue-50', // Corrected key
    completed: 'border-green-200 bg-green-50'
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as TaskStatus;
    moveTask(draggableId, newStatus, destination.index);
  };

  // Handle loading and error states for the task list
  if (isLoading && tasks.length === 0) { // Show loader if loading and no tasks yet (initial load)
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="ml-4 text-lg text-gray-600">Carregando tarefas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <h3 className="text-lg font-medium mb-2">Erro ao carregar tarefas</h3>
        <p>{error}</p>
      </div>
    );
  }
  
  if (!isLoading && tasks.length === 0) { // Message if not loading and still no tasks
    return (
      <div className="text-center py-12">
        <List className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhuma tarefa encontrada
        </h3>
        <p className="text-gray-500">
          Comece criando sua primeira tarefa usando o formulário acima.
        </p>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['pending', 'in progress', 'completed'] as TaskStatus[]).map(status => { // Corrected status key
            const statusTasks = getTasksByStatus(status);
            return (
              <div key={status} className={`p-4 rounded-lg border-2 ${statusColors[status]}`}>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  {statusLabels[status]} ({statusTasks.length})
                </h2>
                
                <Droppable droppableId={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-4 min-h-[200px] p-2 rounded-lg transition-colors ${
                        snapshot.isDraggingOver ? 'bg-gray-100' : ''
                      }`}
                    >
                      {statusTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`${
                                snapshot.isDragging ? 'rotate-3 shadow-lg' : ''
                              } transition-transform`}
                            >
                              <TaskCard 
                                task={task} 
                                // Pass down action handlers
                                // updateTaskStatus={updateTaskStatus} - TaskCard might get this from useTask directly or via props
                                // deleteTask={deleteTask}
                                // updateTask={updateTask}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      
                      {statusTasks.length === 0 && !snapshot.isDraggingOver && (
                        <p className="text-gray-500 text-center py-8">
                          Nenhuma tarefa {status === 'pending' ? 'pendente' : status === 'in progress' ? 'em progresso' : 'concluída'}
                        </p>
                      )}
                    </div>
                  )}
                </Droppable>
                
                <div className="mt-4">
                  <QuickAddTask status={status} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DragDropContext>
  );
};
