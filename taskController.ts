const cache: { [key: string]: any } = {};

function getTasksFromCache(cacheKey: string): any[] | undefined {
  if (cache[cacheKey]) {
    console.log('Returning cached tasks');
    return cache[cacheKey];
  }
  return undefined;
}

async function fetchAndCacheTasks(cacheKey: string): Promise<any[]> {
  console.log('Fetching tasks from the database');
  const tasks = await Task.find();
  cache[cacheKey] = tasks;
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