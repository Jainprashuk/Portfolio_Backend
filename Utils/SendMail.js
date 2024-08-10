const transporter = require('../Config/Nodemailer.js')

function sendOtpEmail(email, otp) {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = sendOtpEmail;
