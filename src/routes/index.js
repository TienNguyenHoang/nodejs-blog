import { index } from '../app/controllers/user/HomeController.js';

function route(app) {
    app.get('/post/:slug', index);
    app.get('/', index);
}

export default route;
