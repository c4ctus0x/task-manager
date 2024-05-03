import { Request, Response } from 'express';

interface Task {
}

interface CacheEntry {
  expiry: number;
  data: any[];
}

const cache: { [key: string]: CacheEntry } = {};
const CACHE_TTL = 1000 * 60 * 5;

function getTasksFromCache(cacheKey: string): any[] | undefined {
  const entry = cache[cacheKey];
  if (entry && entry.expiry > Date.now()) {
    console.log('Returning cached tasks');
    return entry.data;
  } else if (entry) {
    console.log('Cache expired, fetching new data');
    delete cache[cacheKey];
  }
  return undefined;
}

async function fetchAndCacheTasks(cacheKey: string): Promise<any[]> {
  console.log('Fetching tasks from the database');
  const tasks: Task[] = await Task.find();
  cache[cacheKey] = {
    expiry: Date.now() + CACHE_TTL,
    data: tasks,
  };
  return tasks;
}

export const getAllTasks = async (_req: Request, res: Response) => {
  const cacheKey = 'allTasks';
  try {
    let tasks = getTasksFromCache(cacheKey);
    if (!tasks) {
      tasks = await fetchAndCacheTasks(cacheKey);
    }
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error.message);
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};

const Task = {
  async find() {
    return [];
  },
};