const cron = require('node-cron');
const db = require('../db');
const { sendDeadlineReminder } = require('./email');

const notifiedTasks = new Set();

const checkDeadlinesNow = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT tasks.id, tasks.title, tasks.deadline, users.email 
            FROM tasks 
            JOIN users ON tasks.userId = users.id 
            WHERE tasks.status != 'completed' 
            AND tasks.deadline IS NOT NULL
        `;

        db.all(sql, [], async (err, tasks) => {
            if (err) {
                console.error("Error fetching tasks for cron:", err);
                return reject(err);
            }

            const previewUrls = [];
            const now = new Date();
            
            for (const task of tasks) {
                if (task.deadline) {
                    const taskDeadline = new Date(task.deadline);
                    // Trigger if deadline is within the next 24 hours
                    const isUpcoming = (taskDeadline.getTime() - now.getTime()) <= 24 * 60 * 60 * 1000;
                    
                    if (isUpcoming && !notifiedTasks.has(task.id)) {
                        console.log(`[Email Triggered] Sending reminder for task: ${task.title}`);
                        try {
                            const url = await sendDeadlineReminder(task.email, task.title, task.deadline);
                            previewUrls.push({ title: task.title, url });
                            notifiedTasks.add(task.id);
                        } catch (e) {
                            console.error("Email send failed:", e);
                        }
                    }
                }
            }
            resolve(previewUrls);
        });
    });
};

const checkDeadlines = () => {
    cron.schedule('* * * * *', () => {
        console.log('Running scheduled deadline check...');
        checkDeadlinesNow().catch(console.error);
    });
    console.log('Cron job for deadline reminders initialized.');
};

module.exports = { checkDeadlines, checkDeadlinesNow };
