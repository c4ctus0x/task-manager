import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

interface ITask {
    _id: mongoose.Types.ObjectId;
    name: string;
    description: string;
    completed: boolean;
}

interface ITaskModel extends mongoose.Model<ITask> {}

const TaskSchema = new mongoose.Schema<ITask>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    completed: { type: Boolean, default: false }
});

const TaskModel = mongoose.model<ITask, ITaskModel>('Task', TaskSchema);

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI || '', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log(err));

app.get('/tasks', async (req: Request, res: Response) => {
    try {
        const searchTerm = req.query.search as string;
        let filterCriteria = {};

        if (searchTerm) {
            filterCriteria = {
                $or: [
                    { name: { $regex: searchTerm, $options: 'i' } },
                    { description: { $regex: searchTerm, $options: 'i' } }
                ]
            };
        }

        const tasksFound = await TaskModel.find(filterCriteria);
        res.json(tasksFound);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/tasks', async (req: Request, res: Response) => {
    try {
        const newTask = new TaskModel(req.body);
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.put('/tasks/:id', async (req: Request, res: Response) => {
    try {
        const taskToUpdate = await TaskModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        if (!taskToUpdate) {
            return res.status(404).send('Task not found');
        }

        res.json(taskToUpdate);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.delete('/tasks/:id', async (req: Request, res: Response) => {
    try {
        const deletedTask = await TaskModel.findByIdAndDelete(req.params.id);
        
        if (!deletedTask) {
            return res.status(404).send('Task not found');
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).send(error);
    }
});

app.use((err: Error, req: Request, res: Response, next: Function) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});