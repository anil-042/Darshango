import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendVerificationEmail = async (to: string, code: string) => {
    const mailOptions = {
        from: process.env.SMTP_FROM,
        to,
        subject: 'Verify your email - DarshanGo',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Verify your email address</h2>
                <p>Thank you for signing up. Please use the following code to verify your email address:</p>
                <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
                    <h1 style="margin: 0; letter-spacing: 5px; color: #333;">${code}</h1>
                </div>
                <p>This code will expire in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to ${to}`);
    } catch (error: any) {
        console.error('Error sending email:', error);
        console.error('SMTP Config:', {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS ? '****' : 'MISSING'
        });
        throw new Error(`Failed to send verification email: ${error.message}`);
    }
};
