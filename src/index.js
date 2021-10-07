import 'dotenv/config';
import cors from 'cors';
import express from 'express';

import { connectDb } from './models';
import routes from './routes';
import controllers from './controllers';

const app = express();
// * Application-Level Middleware * //

// Third-Party Middleware

app.use(cors());

// Built-In Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom Middleware

// app.use("newPeople", controllers.)

connectDb().then(async () => {
    if (eraseDatabaseOnSync) {
      await Promise.all([
        models.User.deleteMany({}),
        models.Message.deleteMany({}),
      ]);
  
      createUsersWithMessages();
    }
  
    app.listen(process.env.PORT, () =>
      console.log(`Example app listening on port ${process.env.PORT}!`),
    );
  });