import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

import { db } from './models';
import eventRouter from './routers/eventRouter';

dotenv.config();
const app = express();

const initServer = (async () => {
  await db.sequelize.sync({ force: false });

  app.set('port', process.env.PORT || 8080);
  app.use(bodyParser.json()); // for parsing application/json
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get('/', (req, res) => {
    res.json({ message: 'This is server root page' });
  });

  app.use('/events', [eventRouter]);

  app.listen(app.get('port'), () => {
    console.log(`Express server listening at http://localhost:${app.get('port')}`);
  });
});

if (process.env.ENV !== 'test') {
  initServer();
}

export default { initServer, app };
