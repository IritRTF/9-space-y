const mars = {}

const getUser = (req) => {
    return req.cookies ? .username || 'Anonymous'
}

export default class SendToMars {
    static send(req, res) {
        const name = getUser(req);

        console.log(req.body);

        const item = req.body['item'];

        if (name in mars) {
            mars[name].push(item)
        } else {
            mars[name] = [item];
        }

        console.log(mars);
        res.json(mars[name]);
    }

    static cancel(req, res) {
        const name = getUser(req);

        console.log(req.body);

        const item = req.body['item'];

        if (name in mars) {
            const index = mars[name].indexOf(item);
            mars[name].splice(index, 1);
        }

        console.log(mars);
        res.json(mars[name]);
    }

    static get(req, res) {
        const name = getUser(req);

        console.log(mars);
        res.json(mars[name] || []);
    }
}