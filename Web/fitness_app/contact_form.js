const nodemailer = require('nodemailer');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/send-email', async (req, res) => {
    const { email, name, subject, message } = req.body;
    
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'athloboostx@gmail.com', // Replace with your email
            pass: 'Athlo100225#'  // Replace with your email password or app password
        }
    });

    let mailOptions = {
        from: email,
        to: 'athloboostx@gmail.com', // Your email
        subject: subject || 'No Subject',
        html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending email' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
