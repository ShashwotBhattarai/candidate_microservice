// gateway/src/app.ts
import express from 'express';
import bodyParser from 'body-parser';
import authRoute from './routes/auth.routes';
import connectToDatabase from './database/db.connect';
// import uploadServiceRoutes from './routes/uploadServiceRoutes';
// import downloadServiceRoutes from './routes/downloadServiceRoutes';
// import emailServiceRoutes from './routes/emailServiceRoutes';

const app = express();
const port = 3000;

app.use(bodyParser.json());

connectToDatabase();


// app.use('/upload', uploadServiceRoutes);
// app.use('/download', downloadServiceRoutes);
// app.use('/email', emailServiceRoutes);

app.use("/auth", authRoute);

app.listen(port, () => {
  console.log(`Gateway is running on port ${port}`);
});
