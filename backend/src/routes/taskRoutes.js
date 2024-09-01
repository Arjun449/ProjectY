// src/routes/taskRoutes.js

import express from 'express';
import Task from '../models/Task.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Create a task
router.post('/', protect, async (req, res) => {
    try {
        const task = await Task.create({ ...req.body, user: req.user._id });
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get tasks
router.get('/', protect, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id });
        res.json(tasks);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a task
router.put('/:id', protect, async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a task
router.delete('/:id', protect, async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task removed' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get task statistics
router.get('/stats', protect, async (req, res) => {
    try {
        const lowPriorityCount = await Task.countDocuments({ priority: 'Low', user: req.user._id });
        const mediumPriorityCount = await Task.countDocuments({ priority: 'Medium', user: req.user._id });
        const highPriorityCount = await Task.countDocuments({ priority: 'High', user: req.user._id });

        res.json({
            lowPriority: lowPriorityCount,
            mediumPriority: mediumPriorityCount,
            highPriority: highPriorityCount,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
