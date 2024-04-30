import React, { useState, FormEvent } from 'react';

interface ITaskFormState {
  description: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
}

const TaskForm: React.FC<{ onSave: (task: ITaskFormState) => void }> = ({ onSave }) => {
  const [formState, setFormState] = useState<ITaskFormState>({
    description: '',
    dueDate: '',
    priority: 'Medium',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const validateForm = (): boolean => {
    const { description, dueDate, priority } = formState;
    return !!description && !!dueDate && !!priority;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formState);
      setFormState({ description: '', dueDate: '', priority: 'Medium' });
    } else {
      alert('Please fill in all fields.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="description">Description:</label>
        <input
          type="text"
          id="description"
          name="description"
          value={formState.description}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="dueDate">Due Date:</label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          value={formState.dueDate}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="priority">Priority:</label>
        <select
          id="priority"
          name="priority"
          value={formState.priority}
          onChange={handleChange}
          required
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
      <button type="submit">Save Task</button>
    </form>
  );
};

export default TaskForm;