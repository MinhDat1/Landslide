const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

// Define a GET route to get data from Azure SQL Database
router.get('/sendemail', dataController.sendEmailAlert);
router.get('/sendsms', dataController.sendSmsAlert);
router.get('/landside', dataController.getDataFromDatabase);

module.exports = router;
