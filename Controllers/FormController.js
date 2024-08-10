const Form = require('../Model/Form.js'); 

exports.submitForm = async (req, res) => {
  const { email, subject, message } = req.body;

  try {
    // Create a new form entry
    const formEntry = new Form({
      email,
      subject,
      message,
    });

    // Save the form entry to the database
    await formEntry.save();

    // Send a success response
    res.status(200).json({ message: 'Form submitted successfully' });
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).json({ message: 'Failed to submit form' });
  }
};
