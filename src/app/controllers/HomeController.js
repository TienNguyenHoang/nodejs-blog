const index = (req, res, next) => {
    res.render('home', {
        title: 'Trang chủ',
    });
};

const about = (req, res, next) => {
    res.render('about', {
        title: 'Về chúng tôi',
    });
};

export { index };
