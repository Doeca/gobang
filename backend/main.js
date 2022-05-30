import User from './user.js'
import Room from './room.js'
import express from 'express'
const app = express()

var server = app.listen(8082, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
})

app.use('/', express.static('../public'));

// 设置允许跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

// 账户系统
app.get("/user/login", (req, res) => {
    let info = JSON.parse(Buffer.from(req.query.info, "base64").toString('utf-8'));
    let out = User.Login(info);
    res.send(out);
    if (out.mode == 1) {
        //cookie 系统待做
        //res.cookie()
    }
});

app.get("/user/register", (req, res) => {
    //客户端将把注册的表单对象 base64编码后传过来，省去构造复杂url
    let info = JSON.parse(Buffer.from(req.query.info, "base64").toString('utf-8'));
    let out = User.AddUser(info);
    res.send(out);
    if (out.mode == 1) {
        //cookie 系统待做
        //res.cookie()
    }
});

// 房间系统（网络对战用）
app.get("/room/create", (req, res) => {
    let info = JSON.parse(Buffer.from(req.query.info, "base64").toString('utf-8'));
    let out = Room.CreateRoom(info);
    res.send(out);
});

app.get("/room/read", (req, res) => {
    let room = JSON.parse(Buffer.from(req.query.room, "base64").toString('utf-8'));
    let out = Room.ReadRoom(room);
    res.send(out);
});
app.get("/room/close", (req, res) => {
    let room = JSON.parse(Buffer.from(req.query.room, "base64").toString('utf-8'));
    let out = Room.CloseRoom(room);
    res.send(out);
});

app.get("/room/join", (req, res) => {
    let info = JSON.parse(Buffer.from(req.query.info, "base64").toString('utf-8'));
    let room = JSON.parse(Buffer.from(req.query.room, "base64").toString('utf-8'));
    let out = Room.JoinRoom(info, room);
    res.send(out);
});

app.get("/room/write", (req, res) => {
    let info = JSON.parse(Buffer.from(req.query.info, "base64").toString('utf-8'));
    let room = JSON.parse(Buffer.from(req.query.room, "base64").toString('utf-8'));
    let data = JSON.parse(Buffer.from(req.query.data, "base64").toString('utf-8'));
    let out = Room.WriteRoom(info, room, data);
    res.send(out);
});