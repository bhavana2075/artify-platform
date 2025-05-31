const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

// CORS configuration
app.use(cors({
  origin: 'https://artify-platform-frontend.onrender.com', // allow frontend origin
  credentials: true                // allow cookies/auth headers
}));

app.use(express.json());

console.log("Loading /api/auth routes");

// Routes
const authRoutes = require('./routes/auth');
const artworkRoutes = require('./routes/artworks');
app.use('/api/auth', authRoutes);
app.use('/api/artworks', artworkRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
