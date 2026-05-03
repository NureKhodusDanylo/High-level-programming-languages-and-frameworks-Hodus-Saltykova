const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const generateRandomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

db.serialize(() => {
    console.log('Seeding database with random users and tasks...');

    // 1. Create 5 users
    const stmtUser = db.prepare(`INSERT INTO users (email, password, role) VALUES (?, ?, 'user')`);
    const hash = bcrypt.hashSync('password123', 10);
    
    for (let i = 1; i <= 5; i++) {
        // use INSERT OR IGNORE just in case they exist
        db.run(`INSERT OR IGNORE INTO users (email, password, role) VALUES (?, ?, 'user')`, [`user${i}@test.com`, hash]);
    }
    stmtUser.finalize();

    // 2. Generate tasks
    // We need some tasks completed in the last 7 days to show up on the chart
    const stmtTask = db.prepare(`INSERT INTO tasks (title, description, status, deadline, createdAt, userId) VALUES (?, ?, ?, ?, ?, ?)`);
    
    const taskTitles = ['Implement feature X', 'Fix bug Y', 'Write documentation', 'Deploy to production', 'Review pull request', 'Update dependencies', 'Design UI mockups', 'Test application', 'Optimize performance', 'Clean up code'];
    
    // We will get all users
    db.all("SELECT id FROM users", [], (err, users) => {
        if (err || users.length === 0) return console.error('No users found');
        
        let taskCount = 0;
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        for (let i = 0; i < 50; i++) {
            const user = users[Math.floor(Math.random() * users.length)];
            const title = taskTitles[Math.floor(Math.random() * taskTitles.length)] + ' ' + i;
            const description = 'Auto-generated task description ' + i;
            
            // 40% completed, 60% pending
            const status = Math.random() < 0.4 ? 'completed' : 'pending';
            
            // Created at some point in the last 10 days
            const createdAt = generateRandomDate(new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), now).toISOString();
            
            // Deadline at some point between 5 days ago and 7 days in the future
            const deadline = generateRandomDate(new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), nextWeek).toISOString();

            stmtTask.run([title, description, status, deadline, createdAt, user.id], (err) => {
                if (!err) taskCount++;
                if (i === 49) {
                    console.log(`Successfully seeded ${taskCount} tasks!`);
                    // Admin cache clear logic from routes (hard to call here, but they can just refresh)
                }
            });
        }
        stmtTask.finalize();
    });
});
