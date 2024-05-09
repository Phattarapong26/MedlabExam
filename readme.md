// eslint-disable-next-line no-unused-vars
import React from 'react'
import './App.css'
// import Overview from './page/Component/page/Overview/Overview'

function App() {
  return (
  //   <div style={{ alignItems: "center", textAlign: "center", border:'1px solid red', width:'100vw',height:'100vh', display:'flex',justifyContent:'center', backgroundColor:'white'}}>
  //     <Overview/>
  //   </div>
  // )

  <div>
    <h>hello</h>
  </div>
}

export default App




const mysql = require("mysql");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();

// Middleware
app.use(cors({
  credentials: true,
  origin: "http://localhost:5173", // Adjust the origin as needed
  exposedHeaders: ["SET-COOKIE"],
}));
app.use(cookieParser());
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  port: "3306",
  password: "root",
  database: "medlab",
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to database");
});

// GET endpoint to fetch events data
app.get('/events', (req, res) => {
  db.query('SELECT * FROM events', (err, results) => {
    if (err) {
      console.error('Error fetching events from database:', err);
      res.status(500).json({ error: 'Error fetching events from database' });
      return;
    }
    res.status(200).json(results);
  });
});


// Routes

// POST endpoint to create events
app.post('/events', (req, res) => {
  const eventData = req.body;

  // Validate request body
  if (!eventData || !eventData.title || !eventData.startDate || !eventData.startTime || !eventData.endDate || !eventData.endTime) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Insert event data into the events table
  db.query('INSERT INTO events (title, description, start_date, start_time, end_date, end_time, notifications_value, notifications_unit) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [eventData.title, eventData.description, eventData.startDate, eventData.startTime, eventData.endDate, eventData.endTime, eventData.notificationsValue, eventData.notificationsUnit],
    (err, result) => {
      if (err) {
        console.error('Error inserting event into database:', err);
        res.status(500).json({ error: 'Error inserting event into database' });
        return;
      }
      console.log('Event inserted into database:', result.insertId);
      res.status(201).json({ message: 'Event created successfully' });
    });
});

app.listen("3000", () => {
  console.log("Server is running on port 3000");
});
# MedlabExam
