const express = require('express');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');
const NodeCache = require('node-cache');

const router = express.Router();
// Cache tasks for 30 seconds
const cache = new NodeCache({ stdTTL: 30, checkperiod: 60 });

const cacheMiddleware = (req, res, next) => {
    const key = `tasks_${req.user.id}_${req.user.role}`;
    const cachedData = cache.get(key);
    if (cachedData) {
        res.set('X-Cache', 'HIT');
        return res.json(cachedData);
    }
    res.set('X-Cache', 'MISS');
    res.sendResponse = res.json;
    res.json = (body) => {
        cache.set(key, body);
        res.sendResponse(body);
    };
    next();
};

// Clear cache when data changes
const clearCache = (userId, role) => {
    cache.del(`tasks_${userId}_${role}`);
    // Admin cache might also need clearing
    cache.del(`tasks_${userId}_admin`); 
    // In a real scenario we'd track more keys, but let's flush all for simplicity
    cache.flushAll(); 
};

// Get tasks
router.get('/', authMiddleware, cacheMiddleware, (req, res) => {
    let sql = `SELECT * FROM tasks WHERE userId = ?`;
    let params = [req.user.id];

    if (req.user.role === 'admin') {
        sql = `SELECT tasks.*, users.email as userEmail FROM tasks LEFT JOIN users ON tasks.userId = users.id`;
        params = [];
    }

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ message: 'Error retrieving tasks' });
        res.json(rows);
    });
});

// Create task
router.post('/', authMiddleware, (req, res) => {
    const { title, description, deadline } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const sql = `INSERT INTO tasks (title, description, deadline, userId) VALUES (?, ?, ?, ?)`;
    db.run(sql, [title, description, deadline, req.user.id], function(err) {
        if (err) return res.status(500).json({ message: 'Error creating task' });
        clearCache(req.user.id, req.user.role);
        res.status(201).json({ id: this.lastID, title, description, deadline, status: 'pending', userId: req.user.id });
    });
});

// Update task (text or status)
router.put('/:id', authMiddleware, (req, res) => {
    const { title, description, status, deadline } = req.body;
    const taskId = req.params.id;

    // Check ownership or admin
    db.get(`SELECT * FROM tasks WHERE id = ?`, [taskId], (err, task) => {
        if (err || !task) return res.status(404).json({ message: 'Task not found' });
        if (task.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const sql = `UPDATE tasks SET title = ?, description = ?, status = ?, deadline = ? WHERE id = ?`;
        db.run(sql, [title || task.title, description || task.description, status || task.status, deadline || task.deadline, taskId], (err) => {
            if (err) return res.status(500).json({ message: 'Error updating task' });
            clearCache(req.user.id, req.user.role);
            res.json({ message: 'Task updated successfully' });
        });
    });
});

// Delete task
router.delete('/:id', authMiddleware, (req, res) => {
    const taskId = req.params.id;

    db.get(`SELECT * FROM tasks WHERE id = ?`, [taskId], (err, task) => {
        if (err || !task) return res.status(404).json({ message: 'Task not found' });
        if (task.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        db.run(`DELETE FROM tasks WHERE id = ?`, [taskId], (err) => {
            if (err) return res.status(500).json({ message: 'Error deleting task' });
            clearCache(req.user.id, req.user.role);
            res.json({ message: 'Task deleted successfully' });
        });
    });
});

// Get task details
router.get('/:id', authMiddleware, (req, res) => {
    const taskId = req.params.id;
    db.get(`SELECT * FROM tasks WHERE id = ?`, [taskId], (err, task) => {
        if (err || !task) return res.status(404).json({ message: 'Task not found' });
        if (task.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        res.json(task);
    });
});

// Manual trigger for email reminders
router.post('/trigger-reminders', authMiddleware, async (req, res) => {
    const { checkDeadlinesNow } = require('../services/cron');
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Only admins can trigger reminders' });
    }
    
    try {
        const previewUrls = await checkDeadlinesNow();
        res.json({ message: 'Reminders triggered successfully!', emails: previewUrls });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to trigger reminders' });
    }
});

// Manual trigger for a single task
router.post('/:id/remind', authMiddleware, (req, res) => {
    const { sendDeadlineReminder } = require('../services/email');
    const sql = `SELECT tasks.*, users.email as userEmail FROM tasks LEFT JOIN users ON tasks.userId = users.id WHERE tasks.id = ?`;
    db.get(sql, [req.params.id], async (err, task) => {
        if (err || !task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        if (task.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden' });
        }
        try {
            const targetEmail = task.userEmail || req.user.email;
            const url = await sendDeadlineReminder(targetEmail, task.title, task.deadline || 'No deadline');
            res.json({ message: 'Reminder sent!', url });
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Failed to send reminder' });
        }
    });
});

module.exports = router;
