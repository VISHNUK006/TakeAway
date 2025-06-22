const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,       
        pass: process.env.EMAIL_PASS,    
      }
    });

    const mailOptions = {
      from: `"Restaurant Admin" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    };

    await transporter.sendMail(mailOptions);
    console.log('📧 Email sent to', to);
  } catch (err) {
    console.error('❌ Email send failed:', err.message);
  }
};

module.exports = sendEmail;
