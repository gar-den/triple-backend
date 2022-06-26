import express from 'express';
import dotenv from 'dotenv';

import { db } from './models';

dotenv.config();

const initServer = (async () => {
  const app = express();

  await db.newSequelize.sync();

  app.set('port', process.env.PORT || 8080);

  app.get('/', (req, res) => {
    // connection.query('SELECT * FROM ')

    res.json({ message: 'This is server root page' });
  });

  app.listen(app.get('port'), () => {
    console.log(`Express server listening at http://localhost:${app.get('port')}`);
  });
});

initServer();
