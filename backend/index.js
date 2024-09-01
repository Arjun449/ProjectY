// src/index.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import connectDB from './src/config/db.js'; // Updated import path if needed
import authRoutes from './src/routes/authRoutes.js';
import taskRoutes from './src/routes/taskRoutes.js';
import { notFound, errorHandler } from './src/middlewares/errorMiddleware.js'; // Updated import path if needed

// Initialize environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:5173', // Adjust this to match your frontend URL
    methods: ['GET', 'POST'],
};

// Middlewares
app.use(express.json());
app.use(cors(corsOptions)); // Apply CORS configuration

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes); // Task routes

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Create HTTP server and integrate Socket.io
const server = http.createServer(app);
const io = new SocketServer(server, {
    cors: {
        origin: 'http://localhost:5173', // Adjust this to match your frontend URL
        methods: ['GET', 'POST'],
    },
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('New client connected: ' + socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected: ' + socket.id);
    });

    // Custom event handling for task updates
    socket.on('task-updated', () => {
        io.emit('task-updated');
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
