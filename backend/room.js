import User from "./user.js"
import fs from 'fs'

class Room {
    roomData = [];
    constructor() {
        this.LoadFromFile();
    }

    LoadFromFile() {
        try {
            if (fs.existsSync("./data/rooms.json")) {
                let buf = fs.readFileSync("./data/rooms.json");
                if (buf != '') {
                    this.roomData = JSON.parse(buf);
                    console.log(`Status: Room data file has been loaded`);
                }
            }
        } catch (e) {
            console.error(`Error: Room data file has something wrong : ${e}`)
        }
    }

    CreateRoom(info) {
        let u = User.FindUser(info);
        if (u.mode == 0)
            return u;
        //创建一个房间，写入当前玩家数据
        let room = {
            users: [],
            operations: [],
            status: 0
        };
        room.id = this.roomData.length;
        u.info.sign = 1; //房主棋色为黑棋
        room.users.push(u.info); //将该玩家加入房间中

        this.roomData.push(room);
        fs.writeFileSync("./data/rooms.json", JSON.stringify(this.roomData));

        return { mode: 1, room: room }
    }

    CreatePveRoom(info) {
        let u = User.FindUser(info);
        if (u.mode == 0)
            return u;
        //创建一个房间，写入当前玩家数据
        let room = {
            users: [],
            operations: [],
            status: 0
        };
        room.id = this.roomData.length;
        u.info.sign = 1; //房主棋色为黑棋
        room.users.push(u.info);
        room.users.push(u.info); //人机对战房间直接满员

        this.roomData.push(room);
        fs.writeFileSync("./data/rooms.json", JSON.stringify(this.roomData));

        return { mode: 1, room: room }
    }

    FindRoom(room) {
        if (room.id == '')
            return { mode: 0, err: 100, msg: "empty params" };
        let res = {};
        this.roomData.forEach((v, i) => {
            if (room.id == v.id)
                res = { mode: 1, index: i, room: v };
        });
        if (res.mode == 1)
            return res;
        else
            return { mode: 0, err: 104, msg: "no such room" };
    }

    JoinRoom(info, room) {
        let u = User.FindUser(info);
        if (u.mode == 0)
            return u;
        let r = this.FindRoom(room);
        if (r.mode == 0)
            return r;
        let i = r.index;


        //如果该用户是房间用户之一，返回允许进入


        //如果该房间仅有一名玩家，返回允许进入并把此人加入玩家列表
        if (r.room.users.length < 2) {
            if (r.room.users[0].id == info.id)
                return { mode: 1, room: this.roomData[i] };
            u.info.sign = -1;
            this.roomData[i].users.push(u.info);
            return { mode: 1, room: this.roomData[i] };
        }
        if (r.room.users[0].id == info.id || r.room.users[1].id == info.id)
            return { mode: 1, room: this.roomData[i] };

        return { mode: 0, msg: "人数已满" };
    }

    RoomList() {

    }

    ReadRoom(room) {
        //读取房间数据
        let r = this.FindRoom(room);
        return r;
    }

    WriteRoom(info, room, data) {
        //向房间写入数据
        let u = User.FindUser(info);
        if (u.mode == 0)
            return u;
        let r = this.FindRoom(room);
        if (r.mode == 0)
            return r;
        data.userID = info.id;
        //TODO：仅房间玩家可以写入
        let i = r.index;
        this.roomData[i].operations.push(data);
        fs.writeFileSync("./data/rooms.json", JSON.stringify(this.roomData));
        return { mode: 1 }
    }

    CloseRoom(room) {
        let r = this.FindRoom(room);
        if (r.mode == 0)
            return r;
        let i = r.index;
        this.roomData[i].status = 1;
        return { mode: 1 }
    }
}

export default (new Room);