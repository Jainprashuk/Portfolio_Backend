const transporter = require('../Config/Nodemailer.js')

function sendOtpEmail(email, otp) {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Verify Your Email Address for Feedback Submission',
    text: `Dear User,\n\nThank you for reaching out through our feedback form! To ensure the security and authenticity of your submission, we require email verification before processing your response.\n\nPlease use the One-Time Password (OTP) provided below to verify your email address:\n\nOTP: ${otp}\n\nThis OTP is valid for the next 10 minutes. If you did not request this verification or believe this is an error, please disregard this email.\n\nOnce verified, your feedback or inquiry will be submitted successfully. If you encounter any issues or have further questions, feel free to reply to this email.\n\nThank you for your cooperation!\n\nBest regards,\nPrashuk Jain\n29jainprashuk@gmail.com\nwww.jainprashuk.in`,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = sendOtpEmail;
