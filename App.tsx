import React, { useState, useEffect } from 'react';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

interface AppProps {}

const App: React.FC<AppProps> = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/tasks`)
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error("Fetching tasks failed", error));
  }, []);

  const handleNewTaskSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now(), 
      title: newTaskTitle,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  return (
    <div>
      <h1>Task Management Application</h1>
      <form onSubmit={handleNewTaskSubmit}>
        <input 
          type="text" 
          value={newTaskTitle} 
          onChange={(e) => setNewTaskTitle(e.target.value)} 
          placeholder="Add a new task"
        />
        <button type="submit">Add Task</button>
      </form>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.title} - {task.completed ? "Done" : "Pending"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;