const Form = require('../Model/Form.js'); 

exports.submitForm = async (req, res) => {
  const { email, subject, message } = req.body;

  try {
    
    const formEntry = new Form({
      email,
      subject,
      message,
    });

    await formEntry.save();

    res.status(200).json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to submit form' });
  }
};
