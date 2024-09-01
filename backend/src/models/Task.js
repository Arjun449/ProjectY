import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
    completed: { type: Boolean, default: false },
}, { timestamps: true });

const Task = mongoose.model('Task', TaskSchema);

export default Task;
