const express = require('express');
const cors = require('cors');
require('dotenv').config();

const database = require('./config/database');
const schoolRoutes = require('./routes/schoolRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'School Management API is running',
        version: '1.0.0',
        endpoints: {
            'POST /addSchool': 'Add a new school',
            'GET /listSchools': 'Get schools sorted by proximity (requires latitude & longitude query params)',
            'GET /schools': 'Get all schools',
            'GET /schools/:id': 'Get school by ID'
        }
    });
});

app.use('/', schoolRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
    try {
        console.log('Initializing database...');
        await database.initialize();
        
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`API URL: http://localhost:${PORT}`);
            console.log(`Health check: http://localhost:${PORT}/`);
            console.log('Available endpoints:');
            console.log(`POST http://localhost:${PORT}/addSchool`);
            console.log(`GET  http://localhost:${PORT}/listSchools?latitude=X&longitude=Y`);
            console.log(`GET  http://localhost:${PORT}/schools`);
            console.log(`GET  http://localhost:${PORT}/schools/:id`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
}

startServer();

module.exports = app;
