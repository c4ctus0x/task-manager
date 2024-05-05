// TaskList.tsx
import React, { useState, FC } from 'react';

interface Task {
  id: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'completed';
}

interface TaskListProps {
  tasks: Task[];
  onDelete: (ids: string[]) => void; // Adjust to accept an array
  onEdit: (id: string) => void; // Assuming edits happen one at a time for simplicity, but this can also be batched similarly
}

const TaskList: FC<TaskListProps> = ({ tasks, onDelete, onEdit }) => {
  const [error, setError] = useState<string | null>(null);
  const [toBeDeleted, setToBeDeleted] = useState<string[]>([]); // Track IDs to be deleted

  // Batch delete operation
  const triggerBatchDelete = () => {
    try {
      onDelete(toBeDeleted);
      setToBeDeleted([]); // Reset after successful deletion
    } catch (error) {
      const errorObj = error as Error;
      console.error("Failed to batch delete tasks", errorObj);
      setError("An error occurred when attempting to delete tasks.");
    }
  };

  const handleDelete = (id: string) => {
    setToBeDeleted([...toBeDeleted, id]); // Accumulate deletable IDs
    // Consideration: Trigger batch delete here or allow manual trigger by the user
  };

  const handleEdit = (id: string) => {
    // Here, editing could potentially be batched in a similar manner if applicable
    try {
      onEdit(id);
    } catch (error) {
      const errorObj = error as Error;
      console.error("Failed to edit task", errorObj);
      setError("An error occurred when attempting to edit a task.");
    }
  };

  return (
    <div className="task-list">
      {error && <p className="error">{error}</p>}
      {tasks.map((task) => (
        <div key={task.id} className={`task-item ${task.status === 'completed' ? 'task-completed' : ''}`}>
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