import siteRouter from './site.js';
import postsRouter from './posts.js';
import commentsRouter from './comment.js';
import authRouter from './auth.js';
import meRouter from './me.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import errorHandler from '../middlewares/errorHandler.js';
import notFound from '../middlewares/notFound.js';

function route(app) {
    app.use('/auth', authRouter);
    app.use('/api/comments', commentsRouter);
    app.use('/posts', postsRouter);
    app.use('/me', isAuthenticated, meRouter);
    app.use('/', siteRouter);
    app.use(notFound);
    app.use(errorHandler);
}

export default route;
