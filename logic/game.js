import User from "./user"
import base64 from 'base-64'
import urlDomain from '../components/Url.jsx';

function GameLogic() {

    this.init = () => {
        this.gameMode = 0; //定义单机或网络对战
        this.gameInfo = {
            room: {},
            sign: 1,
            interval: 0
        }
        this.watchLoded = false;
        this.dot = '';
    }

    this.pullData = async(state) => {
        let room = this.gameInfo.room;
        let url = `http://${urlDomain}/room/read?room=${base64.encode(JSON.stringify(room))}`;
        let res = await fetch(url)
        let backData = await res.json()
        if (backData.mode == 0)
            this.setError();
        else if (backData.mode == 1) {
            this.gameInfo.room = backData.room;
        }

        //如果用户只有一个人，那么渲染界面为等待玩家加入
        let gi = backData.room;

        if (gi.users.length < 2) {
            this.dot = this.dot + ".";
            if (this.dot == '......') this.dot = ".";
            this.setTitle({ title: "等待玩家加入中" + this.dot, content: `房间ID： ${this.gameInfo.room.id}` });
            return { status: 0 };
        }

        let newBoard, victory;
        //如果已经达到人数且已经有操作的，那么开始渲染棋盘，判断游戏是否结束
        if (gi.operations.length > 0) {
            let data = gi.operations[gi.operations.length - 1];
            if (state.board.get(data.vertex) == 0) {
                //如果我的棋盘上没有这颗棋子，说明这是刚刚下的
                newBoard = state.board.set(data.vertex, data.sign);
                victory = this.isVictory(data.sign, newBoard.signMap, data.vertex);

                if (victory) {
                    let resStr = `${data.sign == 1?'黑':'白'}棋胜`;
                    this.setTitle({ title: "游戏结束", content: resStr });
                    this.setMsgBox({ title: "游戏结束", content: resStr });
                    this.setOpen(true);
                    clearInterval(this.gameInfo.interval);
                    //游戏结束，关闭房间
                    let room = { id: this.gameInfo.room.id }
                    let url = `http://${urlDomain}/room/close?room=${base64.encode(JSON.stringify(room))}`;
                    fetch(url);
                } else {
                    this.setTitle({
                        type: "info",
                        title: "游戏进行中",
                        content: `当前回合，${data.sign == 1?'白':'黑'}棋行`
                    });
                }

                return {
                    status: 1,
                    state: {
                        board: newBoard,
                        selectedVertices: [
                            data.vertex
                        ],
                        isBusy: victory
                    }
                }
            }
        } else {
            this.setTitle({
                type: "info",
                title: "游戏进行中",
                content: `当前回合，黑棋行`
            });
        }

        return { status: 0 };

    }

    this.syncData = async(state) => {
        //用于进入房间时同步当前棋盘已经下过的棋
        let room = this.gameInfo.room;
        let url = `http://${urlDomain}/room/read?room=${base64.encode(JSON.stringify(room))}`;
        let res = await fetch(url)
        let backData = await res.json()
        if (backData.mode == 0)
            this.setError();
        else if (backData.mode == 1) {
            this.gameInfo.room = backData.room;
        }
        this.watchLoded = true;
        //如果已经达到人数且已经有操作的，那么开始渲染棋盘，判断游戏是否结束
        if (gi.operations.length > 0) {
            let newBoard, sign = 1,
                finalVertx;
            newBoard = state.board;
            gi.operations.forEach((v, i) => {
                newBoard = newBoard.set(v.vertex, sign);
                sign *= -1;
                finalVertx = v.vertex;
            });

            this.setTitle({ type: "info", title: "游戏进行中", content: `当前回合，${sign == 1?'黑':'白'}棋行` });

            return {
                status: 1,
                state: {
                    board: newBoard,
                    selectedVertices: [
                        finalVertx
                    ],
                    isBusy: false
                }
            }
        } else {
            this.setTitle({
                type: "info",
                title: "游戏进行中",
                content: `当前回合，黑棋行`
            });
        }
        return { status: 0 };

    }

    this.setInterface = (setOpen, setMsgBox, setTitle, setError) => {
        this.setOpen = setOpen;
        this.setMsgBox = setMsgBox;
        this.setTitle = setTitle;
        this.setError = setError;
    }

    this.gameHandle = (state, [x, y]) => {
        let newBoard, victory
        try {
            if (state.board.get([x, y]) != 0)
                throw 101;

            newBoard = state.board.set([x, y], state.sign);
            victory = this.isVictory(state.sign, newBoard.signMap, [x, y]);

            if (victory) {
                let resStr = `${state.sign == 1?'黑':'白'}棋胜`;
                this.setTitle({ type: "info", title: "游戏结束", content: resStr });
                this.setMsgBox({ title: "游戏结束", content: resStr });
                this.setOpen(true);

            } else {
                this.setTitle({ type: "info", title: "游戏进行中", content: `当前回合，${state.sign == 1?'白':'黑'}棋行` });
            }

            return {
                status: 1,
                data: {
                    board: newBoard,
                    sign: state.sign * -1,
                    selectedVertices: [
                        [x, y]
                    ],
                    isBusy: victory
                }
            }

        } catch (e) {
            console.log(e)
        }

    }

    this.onlineHandle = (state, [x, y]) => {
        let gi = this.gameInfo.room;
        if (gi.users.length < 2)
            return { status: 0 }

        //如果操作记录不为0.判断上一步棋是不是本方下的
        if (gi.operations.length > 0) {
            let data = gi.operations[gi.operations.length - 1];
            if (this.gameInfo.sign == data.sign)
                return { status: 0 }
        } else if (this.gameInfo.sign == -1) {
            return { status: 0 }
        }

        let newBoard, victory
        if (state.board.get([x, y]) != 0)
            return { status: 0 }

        newBoard = state.board.set([x, y], this.gameInfo.sign);
        victory = this.isVictory(this.gameInfo.sign, newBoard.signMap, [x, y]);

        if (victory) {
            let resStr = `${this.gameInfo.sign == 1?'黑':'白'}棋胜`;
            this.setTitle({ title: "游戏结束", content: resStr });
            this.setMsgBox({ title: "游戏结束", content: resStr });
            this.setOpen(true);
            clearInterval(this.gameInfo.interval);

            //游戏结束，关闭房间
            let room = { id: this.gameInfo.room.id }
            let url = `http://${urlDomain}/room/close?room=${base64.encode(JSON.stringify(room))}`;
            fetch(url);

        } else {
            this.setTitle({ type: "info", title: "游戏进行中", content: `当前回合，${this.gameInfo.sign == 1?'白':'黑'}棋行` });
        }


        //向服务器上传本次操作数据
        let room = { id: this.gameInfo.room.id }
        let operation = {
            userID: User.info.id,
            vertex: [x, y],
            sign: this.gameInfo.sign
        }
        let url = `http://${urlDomain}/room/write?room=${base64.encode(JSON.stringify(room))}&info=${base64.encode(JSON.stringify(User.info))}&data=${base64.encode(JSON.stringify(operation))}`;
        fetch(url);

        //pullData方法会同步服务器与本地数据，但是防止网络延迟导致自己多下一步棋，本地记录提前更新一次
        this.gameInfo.room.operations.push(operation);

        return {
            status: 1,
            data: {
                board: newBoard,
                sign: state.sign * -1,
                selectedVertices: [
                    [x, y]
                ],
                isBusy: victory
            }
        }
    }

    this.isVictory = (sign, map, vertex) => {

        let count = 0
        let x = vertex[0]
        let y = vertex[1]

        while (--x > 0)
            if (map[y][x] == sign)
                count++
                else break


        x = vertex[0]
        while (++x < 15)
            if (map[y][x] == sign)
                count++
                else break
        if (count >= 4) return true;

        count = 0
        x = vertex[0]
        y = vertex[1]
        while (--y > 0)

            if (map[y][x] === sign)
                count++
                else break
        y = vertex[1]
        while (++y < 15)
            if (map[y][x] === sign)
                count++
                else break
        if (count >= 4) return true;


        count = 0
        x = vertex[0]
        y = vertex[1]
        while (--x > 0 && --y > 0)
            if (map[y][x] === sign)
                count++
                else break
        x = vertex[0]
        y = vertex[1]
        while (++x < 15 && ++y < 15)
            if (map[y][x] === sign)
                count++
                else break
        if (count >= 4) return true;

        count = 0
        x = vertex[0]
        y = vertex[1]
        while (--x > 0 && ++y < 15)
            if (map[y][x] === sign)
                count++
                else break
        x = vertex[0]
        y = vertex[1]
        while (++x < 15 && --y > 0)
            if (map[y][x] === sign)
                count++
                else break
        if (count >= 4) return true;

        return false;
    }

    /*
    每个数据包的结构
    data
    {
        userID: User.info.id,
        vertex:[x,y],
        sign: 1 / -1,
    }

    最后一操作与自己同色时，等待数据刷新
    */

    //只有一个人时不能下棋

}


export default (new GameLogic);