import express from "express";
import mysql from "mysql";
import dotenv from 'dotenv';
import db from "./models";

dotenv.config();

const app = express();

// export const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME
// });

// connection.connect((err) => {
//   if (err) {
//     console.log('ERROR DURING CONNECTING DATABASE');

//     throw err;
//   }

//   console.log('DATABASE CONNECTED');
// });

db.sequelize.sync();

app.set('port', process.env.PORT || 8080);

app.get('/', (req, res) => {
  // connection.query('SELECT * FROM ')

  res.json({ message: 'This is server root page' });
})

app.listen(app.get('port'), () => {
  console.log(`Express server listening at http://localhost:${app.get('port')}`);
})