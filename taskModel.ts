import mongoose, { Schema, Document } from 'mongoose';

interface ITask extends Document {
  description: string;
  dueDate: Date;
  priority: 'High' | 'Medium' | 'Low';
  isCompleted: boolean;
}

const TaskSchema: Schema = new Schema({
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  priority: { type: String, required: true, enum: ['High', 'Medium', 'Low'] },
  isCompleted: { type: Boolean, required: true, default: false }
});

const TaskModel = mongoose.model<ITask>('Task', TaskSchema);

export default TaskModel;