const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./Routes/AuthRoutes.js');
const formRoutes = require('./Routes/FormRoutes.js');
const cors = require('cors')

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://jainprashuk:1234@cluster0.8zj5bmi.mongodb.net/portfolio?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));


dotenv.config();



const app = express();

app.use(cors())
app.use(express.json()); // Parse JSON bodies

// Routes
app.use( authRoutes);
app.use( formRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
