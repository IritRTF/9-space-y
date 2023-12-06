const MarsItems ={};

export default class SendToMars{
    static send(req,res){
        let user = req.cookies.username;
        let item = req.body['item'];
        (user in MarsItems) ? MarsItems[user].push(item):MarsItems[user]=[item];
        res.json(MarsItems[user]);
    }
    static get(req,res){
        res.json(MarsItems[req.cookies.username] || []);
    }
    static cancel(req,res){
        let user = req.cookies.username;
        let item = req.body['item'];
        if (user in MarsItems) {
            const index = MarsItems[user].indexOf(item);
            MarsItems[user].splice(index, 1);
        }
        res.json(MarsItems[user]);
    }
}