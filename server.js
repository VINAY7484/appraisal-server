import express from "express";
import logger from "morgan";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from './config/db.js';
import allRoutes from './routes/api/allRoutes.js'
import useragent from 'express-useragent';


const app = express();

dotenv.config();
// Middleware for parsing JSON bodies
app.use(express.json());

// Enable CORS
app.use(cors());

// Morgan logger for development
app.use(logger("dev"));
app.use(useragent.express());



// Test database connection
connectDB();


// Set up routes
app.get('/', function (req, res) {
  res.send('Welcome to server')
})


app.use('/api/v1', allRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(path.resolve(), "views", "build")));



  app.get("*", (req, res) => {
    res.sendFile(path.join(path.resolve(), "views", "build", "index.html"));
  });
}

// Handle 404 errors
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// General error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    message: error.message
  });
});

// Start the server
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Click here to visit http://localhost:${PORT}`);
});
