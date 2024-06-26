import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Schema and Model
const taskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    completed: { type: Boolean, default: false }
});

const Task = mongoose.model('Task', taskSchema);

mongoose.connect(process.env.MONGODB_URI || '', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log(err));

app.use(express.json());

app.get('/tasks', async (req: Request, res: Response) => {
    try {
        const searchQuery = req.query.search as string;
        let searchFilter = {};

        if (searchQuery) {
            searchFilter = {
                $or: [
                    { name: { $regex: searchQuery, $options: 'i' } },
                    { description: { $regex: searchQuery, $options: 'i' } }
                ]
            };
        }

        const foundTasks = await Task.find(searchFilter);
        res.json(foundTasks);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/tasks', async (req: Request, res: Response) => {
    try {
        const taskToCreate = new Task(req.body);
        await taskToCreate.save();
        res.status(201).json(taskToCreate);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.put('/tasks/:taskId', async (req: Request, res: Response) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.taskId, req.body, { new: true });
        
        if (!updatedTask) {
            return res.status(404).send('Task not found');
        }

        res.json(updatedTask);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.delete('/tasks/:taskId', async (req: Request, res: Response) => {
    try {
        const taskToDelete = await Task.findByIdAndDelete(req.params.taskId);
        
        if (!taskToDelete) {
            return res.status(404).send('Task not found');
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).send(error);
    }
});

// Simplified error handling middleware
app.use((err: Error, req: Request, res: Response, next: Function) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});