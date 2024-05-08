import mongoose, { Schema, Document } from 'mongoose';

interface ITask extends Document {
  description: string;
  dueDate: Date;
  priorityLevel: 'High' | 'Medium' | 'Low';
  isTaskCompleted: boolean;
  markAsCompleted: () => Promise<ITask>;
}

const TaskSchema: Schema<ITask> = new Schema({
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  priorityLevel: {
    type: String,
    required: true,
    enum: ['High', 'Medium', 'Low'],
  },
  isTaskCompleted: { type: Boolean, required: true, default: false }
});

TaskSchema.methods.markAsCompleted = async function(): Promise<ITask> {
  this.isTaskCompleted = true;
  return this.save();
};

const TaskModel = mongoose.model<ITask>('Task', TaskSchema);

export default TaskModel;