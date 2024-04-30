import React from 'react';

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
  return (
    <div className="task-list">
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
            <button onClick={() => onEdit(task.id)}>Edit</button>
            <button onClick={() => onDelete(task.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;