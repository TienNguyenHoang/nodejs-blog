import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import route from './routes/index.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')))
app.use(morgan('combined'));
app.use(express.urlencoded({
  extended: true
}))
app.use(express.json())

route(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});