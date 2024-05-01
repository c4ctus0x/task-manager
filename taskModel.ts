import mongoose, { Schema, Document, Model } from 'mongoose';

interface ITask extends Document {
  description: string;
  dueDate: Date;
  priority: 'High' | 'Medium' | 'Low';
  isCompleted: boolean;
  // Method signature in the interface
  setCompleted: (this: ITask) => Promise<ITask>;
}

const TaskSchema: Schema = new Schema({
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  priority: { type: String, required: true, enum: ['High', 'Medium', 'Low'] },
  isCompleted: { type: Boolean, required: true, default: false }
});

// Implementing the setCompleted function
TaskSchema.methods.setCompleted = async function(this: ITask): Promise<ITask> {
  this.isCompleted = true;
  return this.save();
};

interface TaskModel<T extends Document> extends Model<T> {
  // Static methods can be declared here if needed
}

const TaskModel = mongoose.model<ITask, TaskModel<ITask>>('Task', TaskSchema);

export default TaskModel;