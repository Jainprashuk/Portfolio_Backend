const generateOtp = require('../Utils/Genreateotp.js');
const sendOtpEmail = require('../Utils/SendMail.js');

let otpStore = {}; 

exports.sendOtp = (req, res) => {
  const { email } = req.body;
  const otp = generateOtp();
  console.log('otp genreated' , otp);
  
  otpStore[email] = otp;

  sendOtpEmail(email, otp)
    .then(() => {
      res.status(200).json({ message: 'OTP sent successfully' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error sending email' });
      console.log(error);
      
    });
};

exports.verifyOtp = (req, res) => {

    console.log("coming");
    
  const { email, otp } = req.body;
  console.log(email);
  console.log(otp);
  console.log(otpStore[email])
  

  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  if (otpStore[email] && otpStore[email] == otp) {
    
    delete otpStore[email]; 
    console.log("verified");
    
    return res.status(200).json({ verified: true });
    
  }
  res.status(400).json({ verified: false });
};
