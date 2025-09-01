import express from 'express';
import expressLayout from 'express-ejs-layouts';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import flash from 'connect-flash';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

import route from './routes/index.js';
import db from './config/db.js';
import { getCurrentUser } from './middlewares/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
// app.use(morgan('combined'));
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

app.use(
    session({
        secret: process.env.SESSION_ID,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI,
            collectionName: 'sessions',
            ttl: 60 * 60,
        }),
        cookie: {
            secure: false,
            httpOnly: true,
            maxAge: 1000 * 60 * 60,
        },
    }),
);

app.use(flash(), (req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

app.use(getCurrentUser);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'resources', 'views'));
app.use(expressLayout);
app.set('layout', 'layouts/main');

route(app);

db.connect();

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
