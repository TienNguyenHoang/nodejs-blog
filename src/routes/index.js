import siteRouter from './site.js';
import postsRouter from './posts.js';
import authRouter from './auth.js';
import errorHandler from '../middlewares/errorHandler.js';
import notFound from '../middlewares/notFound.js';

function route(app) {
    app.use('/auth', authRouter);
    app.use('/posts', postsRouter);
    app.use('/', siteRouter);
    app.use(notFound);
    app.use(errorHandler);
}

export default route;
