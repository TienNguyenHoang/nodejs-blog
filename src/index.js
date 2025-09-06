import express from 'express';
import expressLayout from 'express-ejs-layouts';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import flash from 'connect-flash';
import methodOverride from 'method-override';
import morgan from 'morgan';
import { Server } from 'socket.io';
import path from 'path';
import http from 'http';
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

const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));
// app.use(morgan('combined'));
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

app.use(methodOverride('_method'));

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

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Tham gia room theo postId
    socket.on('join-post', (postId) => {
        socket.join(postId);
        console.log(`Socket ${socket.id} joined post ${postId}`);
    });

    // Rời room
    socket.on('leave-post', (postId) => {
        socket.leave(postId);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

app.set('io', io);

db.connect();

server.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
