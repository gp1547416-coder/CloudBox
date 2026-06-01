const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    // Handle CORS preflight options request
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }

    const { to_email, passcode } = req.body;

    if (!to_email || !passcode) {
        return res.status(400).json({ success: false, error: 'Missing parameters.' });
    }

    // Unrestricted Mail Carrier Configuration
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'gp1547416@gmail.com', // <-- Put your actual Gmail address here
            pass: 'inciudpghacxbdzt'     // Your generated Google App Password
        }
    });

    const mailOptions = {
        from: '"CloudBox Security" <gp1547416@gmail.com>', // <-- Put your actual Gmail address here too
        to: to_email,
        subject: 'CloudBox Verification Code',
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                <div style="text-align: center; margin-bottom: 24px;">
                    <h2 style="color: #2563eb; margin: 0; font-size: 24px; font-weight: 700;">CloudBox Verification</h2>
                </div>
                <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
                    To complete your account setup, please use the following 9-digit One Time Password (OTP):
                </p>
                <div style="text-align: center; background-color: #f8fafc; border: 1px dashed #cbd5e1; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                    <span style="font-size: 32px; font-weight: 700; letter-spacing: 2px; color: #1e293b;">${passcode}</span>
                </div>
                <p style="color: #94a3b8; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
                    This security code will expire in 15 minutes. If you did not make this request, you can safely ignore this email.
                </p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ success: true, message: 'Email delivered.' });
    } catch (error) {
        console.error('Mail Transmission Failure:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
