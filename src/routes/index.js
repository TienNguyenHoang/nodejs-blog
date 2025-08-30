import { index } from '../app/controllers/HomeController.js';

function route(app) {
    app.get('/', index);
}

export default route;
