export default (req, res, next) => {
    res.status(404).render('error', {
        layout: false,
        title: '404 - Not Found',
        message: 'Không tìm thấy trang',
        status: 404,
        stack: null,
    });
};
