const nodemailer = require('nodemailer');

let transporter;

if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
        service: 'gmail', // You can change this or use host/port directly
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 465,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
    console.log('Real SMTP transporter configured for:', process.env.SMTP_USER);
} else {
    nodemailer.createTestAccount((err, account) => {
        if (err) {
            console.error('Failed to create a testing account. ' + err.message);
            return;
        }

        transporter = nodemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
                user: account.user,
                pass: account.pass
            }
        });
        console.log('Ethereal Email transporter configured (Test Mode).');
    });
}

const sendDeadlineReminder = (email, taskTitle, deadline) => {
    return new Promise((resolve, reject) => {
        if (!transporter) return reject(new Error('Transporter not ready'));

        let message = {
            from: '"Task Manager" <no-reply@taskmanager.com>',
            to: email,
            subject: `Task Deadline Reminder: ${taskTitle}`,
            text: `Your task "${taskTitle}" is due on ${deadline}. Please complete it soon.`,
            html: `<p>Your task <b>${taskTitle}</b> is due on <b>${deadline}</b>. Please complete it soon.</p>`
        };

        transporter.sendMail(message, (err, info) => {
            if (err) {
                console.log('Error occurred. ' + err.message);
                return reject(err);
            }
            const url = nodemailer.getTestMessageUrl(info);
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', url);
            resolve(url);
        });
    });
};

module.exports = { sendDeadlineReminder };
