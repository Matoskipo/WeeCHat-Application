import express from'express';
import path from'path';
import connectDB from './config/db.config';
import cookieParser from'cookie-parser';
import logger from'morgan';
import bodyParser from 'body-parser';

// import indexRouter from'../routes/index';
import indexRouter from'./routes/userRouter';

connectDB()

var app = express();
app.use(bodyParser.json())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/messenger', indexRouter);
// app.use('/users', usersRouter);

export default app
