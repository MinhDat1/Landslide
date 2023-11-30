const dataModel = require("../models/dataModel");
const nodemailer = require("nodemailer");
const Nexmo = require("nexmo");
const cron = require("node-cron");

let emailSubject = "";
let emailText = "";
let smsRecipient = "";
let smsText = "";

// Function to send email alert
async function sendEmailAlert() {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tdat20010824@gmail.com",
        pass: "cczu aeyt ruzk jkga",
      },
    });

    const mailOptions = {
      from: "tdat20010824@gmail.com",
      to: "mdat2408@gmail.com",
      subject: emailSubject,
      text: emailText,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

// Function to send SMS alert using Nexmo
async function sendSmsAlert() {
  const nexmo = new Nexmo({
    apiKey: "2b5a91ea",
    apiSecret: "bkwQ7krLj5LSP2ab",
  });
  const from = "84522125992";

  return new Promise((resolve, reject) => {
    nexmo.message.sendSms(
      from,
      smsRecipient,
      smsText,
      { type: "unicode" },
      (err, responseData) => {
        if (err) {
          console.error("Error sending SMS:", err);
          reject(err);
        } else {
          resolve(responseData);
        }
      }
    );
  });
}

// Controller to get data from Azure SQL Database and return it to the client
const getDataFromDatabase = async (_req, res) => {
  try {
    const dataFromDatabase = await dataModel.fetchDataFromDatabase();

    if (!dataFromDatabase) {
      console.error("Data from database is undefined");
      return res
        .status(500)
        .json({ error: "Error retrieving data from the database" });
    }

    // Check moisture level and tilt, send email and SMS alerts if conditions are met
    const moistureThreshold = 0.47;
    const tiltThreshold = 0;

    const highMoistureAndTiltData = dataFromDatabase.filter(
      (entry) =>
        entry.Moisture > moistureThreshold && entry.Tilt > tiltThreshold
    );

    if (highMoistureAndTiltData.length > 0) {
      emailSubject = "Landslide Alert";
      emailText = `High moisture levels and tilt detected. Landslide possible. Take necessary precautions.`;

      smsRecipient = "+84522125992";
      smsText =
        "High moisture levels and tilt detected. Landslide possible. Take necessary precautions.";
    }

    res.json(dataFromDatabase);
  } catch (err) {
    console.error("Error during data retrieval:", err);
    res.status(500).json({ error: err.message });
  }
};

// Function to check moisture levels periodically and send email and SMS alerts
function monitorMoistureLevels() {
  cron.schedule("*/10 * * * *", async () => {
    try {
      await getDataFromDatabase();
    } catch (error) {
      console.error("Error monitoring moisture levels:", error);
    }
  });
}

// Start monitoring moisture levels
monitorMoistureLevels();

module.exports = {
  getDataFromDatabase,
  sendEmailAlert,
  sendSmsAlert,
};
