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
  const tasksCacheKey = 'tasksCache';

  useEffect(() => {
    const cachedTasks = localStorage.getItem(tasksCacheKey);
    if (cachedTasks) {
      setTasks(JSON.parse(cachedTasks));
    } else {
      fetch(`${process.env.REACT_APP_API_URL}/tasks`)
        .then(response => response.json())
        .then(data => {
          setTasks(data);
          localStorage.setItem(tasksCacheKey, JSON.stringify(data)); // Cache fetched tasks
        })
        .catch(error => console.error("Fetching tasks failed", error));
    }
  }, []);

  const handleNewTaskSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      title: newTaskTitle,
      completed: false,
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    setNewTaskTitle('');

    // Update local storage (cache)
    localStorage.setItem(tasksCacheKey, JSON.stringify(updatedTasks));

    // For a real-world application, you'd also want to send this to your backend, e.g.:
    // fetch(`${process.env.REACT_APP_API_URL}/tasks`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(newTask),
    // }).then(/* handle response */).catch(/* handle error */);
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