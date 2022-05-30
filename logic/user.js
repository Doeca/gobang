import * as React from 'react';
import base64 from 'base-64'


function User() {
    this.auth = false;
    this.info = {};

    let urlDomain = "127.0.0.1:8080";

    this.login = (act, pwd, setOpen, setMsgBox) => {



        let info = { username: act, pwd: pwd };
        let url = `http://${urlDomain}/user/login?info=${base64.encode(JSON.stringify(info))}`;

        fetch(url).then(res => res.json())
            .then(data => {
                if (data.mode == 0)
                    setMsgBox({ title: "登陆失败", content: "账号或密码错误，请重试！" });
                else if (data.mode == 1) {
                    setMsgBox({ title: "登陆成功", content: `欢迎回来：${decodeURIComponent(data.info.nick)}` });
                    this.auth = true;
                    this.info = data.info;
                }
                setOpen(true);

            })
            .catch(e => {
                /*發生錯誤時要做的事情*/
            })
    }

    this.register = (info, setOpen, setMsgBox, setSuccess) => {
        let url = `http://${urlDomain}/user/register?info=${base64.encode(JSON.stringify(info))}`;
        fetch(url).then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.mode == 0)
                    setMsgBox({ title: "注册失败", content: "该用户名已经存在！" });
                else if (data.mode == 1) {
                    setSuccess(true);
                    setMsgBox({ title: "注册成功", content: `恭喜你注册成功！` });
                }
                setOpen(true);
            }).catch(e => {

            })
    }

    this.logout = () => {
        this.auth = false;
        this.info = {};
    }
};

export default (new User);