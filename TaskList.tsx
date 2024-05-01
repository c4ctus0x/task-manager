import React, { useState } from 'react';

interface Task {
  id: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'completed';
}

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onDelete, onEdit }) => {
  const [error, setError] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    try {
      onDelete(id);
    } catch (error: any) {
      console.error("Failed to delete task", error);
      setError("An error occurred when attempting to delete a task.");
    }
  };

  const handleEdit = (id: string) => {
    try {
      onEdit(id);
    } catch (error: any) {
      console.error("Failed to edit task", error);
      setError("An error occurred when attempting to edit a task.");
    }
  };

  return (
    <div className="task-list">
      {error && <p className="error">{error}</p>}
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`task-item ${task.status === 'completed' ? 'task-completed' : ''}`}
        >
          <div className="task-details">
            <p>Description: {task.description}</p>
            <p>Due Date: {task.dueDate}</p>
            <p>Status: {task.status}</p>
          </div>
          <div className="task-actions">
            <button onClick={() => handleEdit(task.id)}>Edit</button>
            <button onClick={() => handleDelete(task.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;