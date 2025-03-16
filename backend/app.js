import express from 'express';
import { run } from './functions/api.js';
import booksRoutes from './routes/books.routes.js';
import userRoutes from './routes/users.routes.js';
import path from 'path';
import loadEnv from './configs/loadEnv.config.js';
import {
    simulateHeavyProcessing,
    tooBusyHandler,
} from './middlewares/tooBusy.js';

const __dirname = path.resolve();
const app = express();

// Sets ENV variables
loadEnv();

// Connects to MongoDB
run();

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    );
    next();
});

app.use('/api/books', tooBusyHandler, booksRoutes);
app.use('/api/auth', tooBusyHandler, userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

export default app;
