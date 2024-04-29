import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Task from '../models/TaskModel';

interface ITask {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  dueDate: Date;
  status: 'pending' | 'in progress' | 'completed';
}

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, dueDate, status }: ITask = req.body;
    const newTask = new Task({
      title,
      description,
      dueDate,
      status,
    });

    const savedTask = await newTask.save();

    return res.status(201).json(savedTask);
  } catch (error) {
    if (error instanceof Error) {
      // This catches validation errors and other Mongoose errors
      return res.status(400).json({ message: error.message });
    }
    // For unknown errors
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};

export const getTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: 'Invalid task ID format' });
    }
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};

export const getAllTasks = async (_req: Request, res: Response) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: 'Invalid task ID format' });
    }

    const updates: ITask = req.body;

    const updatedTask = await Task.findByIdAndUpdate(taskId, updates, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(updatedTask);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: 'Invalid task ID format' });
    }

    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};