import fs from 'fs'
import crypto from 'crypto'

function getMd5(str) {
    return crypto.createHash('md5').update(str).digest("hex");
}

class User {
    //用户数据
    userData = [];

    constructor() {
        this.loadFromFile();
    }

    loadFromFile() {
        try {
            if (fs.existsSync("./data/users.json")) {
                let buf = fs.readFileSync("./data/users.json");
                if (buf != '') {
                    this.userData = JSON.parse(buf);
                    console.log(`Status: User data file has been loaded`);
                }
            }
        } catch (e) {
            console.error(`Error: User data file has something wrong : ${e}`)
        }

    }

    AddUser(info) {
        if (info.username == '' || info.pwd == '')
            return { mode: 0, err: 100, msg: "empty params" };
        if (this.FindUser(info).mode == 1)
            return { mode: 0, err: 101, msg: "user already exist" };
        info.id = this.userData.length
        info.pwd = getMd5(info.pwd);
        this.userData.push(info)
        fs.writeFileSync("./data/users.json", JSON.stringify(this.userData));
        return { mode: 1, msg: "success" };
    }

    FindUser(info) {
        if (info.username == '')
            return { mode: 0, err: 100, msg: "empty params" };
        let res = {};
        this.userData.forEach((v, i) => {
            if (info.username == v.username)
                res = { mode: 1, info: v };
        });
        if (res.mode == 1)
            return res;
        else
            return { mode: 0, err: 102, msg: "no such user" };
    }

    Login(info) {
        if (info.username == '' || info.pwd == '')
            return { mode: 0, err: 100, msg: "empty params" };
        let u = this.FindUser(info);
        if (u.mode == 0)
            return u; //这里的u就是没找到用户的错误返回
        if (getMd5(info.pwd) != u.info.pwd)
            return { mode: 0, err: 103, msg: "wrong password" };
        return { mode: 1, info: u.info, msg: "login successfully" };
    }

    ChangeInfo(info) {
        if (info.username == '' || info.pwd == '')
            return { mode: 0, err: 100, msg: "empty params" };
        let u = this.FindUser(info);
        if (u.mode == 0)
            return u;
    }
}

export default (new User);