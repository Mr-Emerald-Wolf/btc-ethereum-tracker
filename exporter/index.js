require("dotenv").config();
const express = require("express");
const promClient = require("prom-client");
const  mongoose = require("mongoose");
const { updateLatestDepositMetrics, getMetrics, initializeMetrics } = require('./services/prometheus_services'); 

const app = express();
const port = 8080;

// Connect to MongoDB 
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Initialise Metrics
initializeMetrics();

// A simple route to simulate requests
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get('/metrics', async (req, res) => {
    try {
      // Update metrics before serving them
      await updateLatestDepositMetrics();
      const metrics = await getMetrics();
      res.set('Content-Type', 'text/plain');
      res.send(metrics);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      res.status(500).send('Internal server error');
    }
  });


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
