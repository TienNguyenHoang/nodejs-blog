export function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    req.baseUrl.includes('api')
        ? res.status(401).json({ success: false, message: 'Bạn cần đăng nhập!' })
        : res.redirect('/auth/login');
}

export function guestRoute(req, res, next) {
    if (req.session.user) {
        return res.redirect('/');
    }
    next();
}

export function getCurrentUser(req, res, next) {
    res.locals.currentUser = req.session.user || null;
    next();
}
