import siteRouter from './site.js'
import postsRouter from './posts.js'

function route(app) {
    app.use('/posts', postsRouter);
    app.use('/', siteRouter);
}

export default route;
