const express = require('express');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
    // Get stats for Recharts (tasks completed by day for the last 7 days)
    // Also return overall totals
    
    let totalSql = `SELECT status, COUNT(*) as count FROM tasks WHERE userId = ? GROUP BY status`;
    let params = [req.user.id];
    let weeklySql = `SELECT date(createdAt) as date, COUNT(*) as count FROM tasks WHERE userId = ? AND status = 'completed' AND createdAt >= date('now', '-7 days') GROUP BY date(createdAt) ORDER BY date(createdAt) ASC`;

    if (req.user.role === 'admin') {
        totalSql = `SELECT status, COUNT(*) as count FROM tasks GROUP BY status`;
        weeklySql = `SELECT date(createdAt) as date, COUNT(*) as count FROM tasks WHERE status = 'completed' AND createdAt >= date('now', '-7 days') GROUP BY date(createdAt) ORDER BY date(createdAt) ASC`;
        params = [];
    }

    db.all(totalSql, params, (err, rows) => {
        if (err) return res.status(500).json({ message: 'Error retrieving total analytics' });
        
        let completed = 0;
        let pending = 0;
        
        rows.forEach(row => {
            if (row.status === 'completed') completed = row.count;
            if (row.status === 'pending') pending = row.count;
        });

        db.all(weeklySql, params, (err, weeklyRows) => {
            if (err) return res.status(500).json({ message: 'Error retrieving weekly analytics' });
            
            res.json({
                completed,
                pending,
                total: completed + pending,
                weeklyData: weeklyRows
            });
        });
    });
});

module.exports = router;
