import React, { useState, useEffect } from 'react';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

interface AppProps {}

const TaskManagerApp: React.FC<AppProps> = () => {
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [newTaskInput, setNewTaskInput] = useState('');
  const localStorageKey = 'taskListStorage';
  const cacheDuration = 1 * 60 * 60 * 1000;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const tasksFromStorage = localStorage.getItem(localStorageKey);
    const cacheTimestamp = localStorage.getItem(`${localStorageKey}:timestamp`);
    const now = new Date().getTime();

    try {
      if (tasksFromStorage && cacheTimestamp) {
        if(now - parseInt(cacheTimestamp) < cacheDuration) {
          setTaskList(JSON.parse(tasksFromStorage));
          return;
        }
      }
    } catch (error) {
      console.error("Error reading from local storage", error);
      setError("Failed to load tasks from local storage.");
    }
    fetchFromAPI();
  }, []);

  const fetchFromAPI = () => {
    fetch(`${process.env.REACT_APP_API_URL}/tasks`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(tasksFromAPI => {
        setTaskList(tasksFromAPI);
        cacheTasks(tasksFromAPI);
      })
      .catch(error => {
        console.error("Fetching tasks failed", error);
        setError("Failed to fetch tasks. Please try again later.");
      });
  };

  const cacheTasks = (tasks: Task[]) => {
    const now = new Date().getTime();
    try {
      localStorage.setItem(localStorageKey, JSON.stringify(tasks));
      localStorage.setItem(`${localStorageKey}:timestamp`, now.toString());
    } catch (error) {
      console.error("Error caching tasks", error);
    }
  };

  const handleTaskSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newTaskInput.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      title: newTaskInput,
      completed: false,
    };

    const updatedTaskList = [...taskList, newTask];
    setTaskList(updatedTaskList);
    setNewTaskInput('');

    cacheTasks(updatedTaskList);
  };

  return (
    <div>
      <h1>Task Manager</h1>
      {error && <p style={{color: "red"}}>{error}</p>}
      <form onSubmit={handleTaskSubmit}>
        <input 
          type="text" 
          value={newTaskInput} 
          onChange={(e) => setNewTaskInput(e.target.value)} 
          placeholder="Add a new task"
        />
        <button type="submit">Add Task</button>
      </form>
      <ul>
        {taskList.map(task => (
          <li key={task.id}>
            {task.title} - {task.completed ? "Done" : "Pending"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManagerApp;