import mongoose, { Schema, Document, Model } from 'mongoose';

interface ITask extends Document {
  description: string;
  dueDate: Date;
  priorityLevel: 'High' | 'Medium' | 'Low';
  isTaskCompleted: boolean;
  markAsCompleted: () => Promise<ITask>; // More descriptive method name
}

const TaskSchema: Schema<ITask> = new Schema({
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  priorityLevel: { type: String, required: true, enum: ['High', 'Medium', 'Low'] }, // Renamed for clarity
  isTaskCompleted: { type: Boolean, required: true, default: false } // Renamed for clarity
});

TaskSchema.methods.markAsCompleted = async function(): Promise<ITask> { // More descriptive method name
  this.isTaskCompleted = true; // Renamed for consistency
  return this.save();
};

const TaskModel = mongoose.model<ITask>('Task', TaskSchema);

export default TaskModel;