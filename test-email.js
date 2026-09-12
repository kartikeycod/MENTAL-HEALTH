import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ALERT_EMAIL,
    pass: process.env.ALERT_EMAIL_PASS,
  }
});

async function testMail() {
  try {
    console.log('Sending test email to:', process.env.ALERT_EMAIL);
    const info = await transporter.sendMail({
      from: process.env.ALERT_EMAIL,
      to: process.env.ALERT_EMAIL, // Send it to yourself for testing
      subject: 'Serenium Test Email',
      text: 'If you are reading this, your email configuration is working perfectly!',
    });
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ Failed to send email:');
    console.error(error.message);
  }
}

testMail();
