const express = require('express');
const cors = require('cors'); 
const path = require('path');
const app = express();
const apiRoutes = require('./routes/api');
const config = require('./config/config');
const sql = require('mssql');

app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("Click to: http://localhost:3000 to open page")

  try {
    await sql.connect(config);
    console.log('Connected to SQL Database');
  } catch (error) {
    console.error('Error connecting to SQL Database', error);
  }
});
