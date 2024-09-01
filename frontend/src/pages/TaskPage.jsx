// src/pages/TaskPage.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

// Connect to Socket.io server
const socket = io('http://localhost:5000');

const TaskPage = () => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    // Fetch tasks from the server
    const fetchTasks = async () => {
        const res = await axios.get('/api/tasks');
        setTasks(res.data);
    };

    // Handle creating a new task
    const handleCreateTask = async (e) => {
        e.preventDefault();
        await axios.post('/api/tasks', { title, description });
        fetchTasks();  // Refresh tasks after adding a new one
        socket.emit('task-updated');  // Notify other clients about the task update
        setTitle('');
        setDescription('');
    };

    // Handle deleting a task
    const handleDeleteTask = async (id) => {
        await axios.delete(`/api/tasks/${id}`);
        fetchTasks();  // Refresh tasks after deleting one
        socket.emit('task-updated');  // Notify other clients about the task update
    };

    // Setup socket event listeners and fetch tasks on component mount
    useEffect(() => {
        fetchTasks();

        // Listen for task updates from the server
        socket.on('task-updated', fetchTasks);

        // Clean up socket event listeners on component unmount
        return () => {
            socket.off('task-updated', fetchTasks);
        };
    }, []);

    return (
        <div className="task-page">
            <h2>Task Management</h2>
            <form onSubmit={handleCreateTask}>
                <input
                    type="text"
                    placeholder="Task Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    placeholder="Task Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                <button type="submit">Add Task</button>
            </form>
            <ul>
                {tasks.map((task) => (
                    <li key={task._id}>
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskPage;
