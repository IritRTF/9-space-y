const notRedirectingUrls = ['login', 'api', 'static'];
export const middleware = function(req, res, next) {
    const root = req.url.split('/')[1];
    const shouldBeSkipped = notRedirectingUrls.includes(root);
    const isFile = root.split('.').length > 1;
    const haveCookie = req.cookies.username !== undefined;
    if (shouldBeSkipped || isFile || haveCookie) {
        next()
    } else
        res.redirect('/login');
};