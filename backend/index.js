// src/index.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
// Route Imports
// Initialize environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);

// Create HTTP server and integrate Socket.io
const server = http.createServer(app);
const io = new SocketServer(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

// Socket.io connection
io.on('connection', (socket) => {
    console.log('New client connected: ' + socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected: ' + socket.id);
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
