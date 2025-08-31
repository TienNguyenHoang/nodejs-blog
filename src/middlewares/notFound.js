export default (req, res, next) => {
    const err = new Error('Không tìm thấy trang');
    err.status = 404;
    next(err);
};
