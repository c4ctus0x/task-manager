import React, { useState, useCallback, FormEvent } from 'react';

interface ITaskFormState {
  description: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
}

interface IErrorState {
  hasError: boolean;
  message: string;
}

const initialFormState: ITaskFormState = {
  description: '',
  dueDate: '',
  priority: 'Medium',
};

const initialErrorState: IErrorState = { hasError: false, message: '' };

const TaskForm: React.FC<{ onSave: (task: ITaskFormState) => void }> = ({ onSave }) => {
  const [formState, setFormState] = useState<ITaskFormState>(initialFormState);
  const [error, setError] = useState<IErrorState>(initialErrorState);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));

    if (error.hasError) {
      setError(initialErrorState);
    }
  }, [error.hasError]);

  const validateForm = (): boolean => {
    const { description, dueDate } = formState;

    if (!description) {
      setError({ hasError: true, message: 'Description is required.' });
      return false;
    }
    if (!dueDate) {
      setError({ hasError: true, message: 'Due Date is required.' });
      return false;
    }
    if (new Date(dueDate) < new Date()) {
      setError({ hasError: true, message: 'Due Date must be in the future.' });
      return false;
    }

    setError(initialErrorState);
    return true;
  };

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formState);
      setFormState(initialFormState);
    }
  }, [formState, onSave]);

  return (
    <form onSubmit={handleSubmit}>
      {error.hasError && <div style={{ color: 'red' }}>{error.message}</div>}
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