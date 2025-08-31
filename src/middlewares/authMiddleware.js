export function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect('/auth/login');
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
