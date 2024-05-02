import mongoose, { Schema, Document, Model } from 'mongoose';

interface ITask extends Document {
  description: string;
  dueDate: Date;
  priority: 'High' | 'Medium' | 'Low';
  isCompleted: boolean;
  setCompleted: () => Promise<ITask>; // Simplified method signature
}

const TaskSchema: Schema<ITask> = new Schema({
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  priority: { type: String, required: true, enum: ['High', 'Medium', 'Low'] },
  isCompleted: { type: Boolean, required: true, default: false }
});

TaskSchema.methods.setCompleted = async function(): Promise<ITask> {
  this.isCompleted = true;
  return this.save();
};

const TaskModel = mongoose.model<ITask>('Task', TaskSchema);

export default TaskModel;