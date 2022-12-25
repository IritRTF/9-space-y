const usernameCookieStr = 'username';

export default class User {

    static get(req, res) {
        const username = req.cookies ? .username;
        res.json({ "username": username });
    }

    static login(req, res) {
        const username = req.query ? .username;
        res.cookie(usernameCookieStr, username, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
        });
        res.json({ "username": username });
    }

    static logout(req, res) {
        res.clearCookie('username');
        res.redirect('/');
    }
}