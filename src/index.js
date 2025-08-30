import express from 'express';
import expressLayout from 'express-ejs-layouts';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

import route from './routes/index.js';
import db from './config/db.js';

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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'resources', 'views'));
app.use(expressLayout);
app.set('layout', 'layouts/main');

route(app);

db.connect();

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
