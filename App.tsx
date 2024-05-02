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

  useEffect(() => {
    const tasksFromStorage = localStorage.getItem(localStorageKey);
    if (tasksFromStorage) {
      setTaskList(JSON.parse(tasksFromStorage));
    } else {
      fetchFromAPI();
    }
  }, []);

  const fetchFromAPI = () => {
    fetch(`${process.env.REACT_APP_API_URL}/tasks`)
      .then(response => response.json())
      .then(tasksFromAPI => {
        setTaskList(tasksFromAPI);
        cacheTasks(tasksFromAPI);
      })
      .catch(error => console.error("Fetching tasks failed", error));
  };

  const cacheTasks = (tasks: Task[]) => {
    localStorage.setItem(localStorageKey, JSON.stringify(tasks));
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