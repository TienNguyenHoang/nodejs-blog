export default (err, req, res, next) => {
    console.error(err.stack);

    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.status(status).render('error', {
        layout: false,
        title: 'Error',
        message,
        status,
        stack: process.env.NODE_ENV === 'development' ? err.stack : null,
    });
};
