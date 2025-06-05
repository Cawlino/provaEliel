
export interface Task {
  id: string; // This might need to be _id from backend, or mapped
  title: string;
  description: string;
  status: 'pending' | 'in progress' | 'completed'; // Matched backend
  createdAt: Date;
  updatedAt: Date;
}

export type TaskStatus = Task['status'];
