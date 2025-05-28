import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import FormateursRoutes  from './routes/formateurs.route.js';
import UsersRoutes from './routes/users.route.js';

const app = express();
const port = 3000;

// Load environment variables from .env file
dotenv.config();

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
    // It's often a good practice to exit the application if the database connection fails
    // as most of the application's functionality will likely depend on it.
    process.exit(1);
  });

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use('/v1/formateurs', FormateursRoutes);
app.use('/v1/users', UsersRoutes);


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});