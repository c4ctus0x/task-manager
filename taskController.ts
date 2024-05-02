// Assuming we're at the top-level of your code file
const cache: { [key: string]: any } = {};

export const getAllTasks = async (_req: Request, res: Response) => {
  const cacheKey = 'allTasks';
  if (cache[cacheKey]) {
    console.log('Returning cached tasks');
    return res.json(cache[cacheKey]);
  }
  
  try {
    const tasks = await Task.find();
    cache[cacheKey] = tasks; // Save fetched tasks to cache
    console.log('Fetching tasks from the database');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};