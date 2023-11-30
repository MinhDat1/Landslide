const sql = require('mssql');
const config = require('../config/config');

async function fetchDataFromDatabase() {
  try {
    await sql.connect(config);
    const result = await sql.query('SELECT Top 10 * FROM Sensor_Entry order by EntryID desc');
    return result.recordset;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching data from database');
  } finally {
    await sql.close();
  }
}

module.exports = {
  fetchDataFromDatabase,
};
