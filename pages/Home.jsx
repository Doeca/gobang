import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { Outlet, Link as RouterLink, useNavigate } from "react-router-dom";
import Appbar from '../components/Appbar.jsx';
import { maxWidth, maxHeight } from '@mui/system';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import base64 from 'base-64'
import MessageBox from "../components/MessageBox.jsx"
import DataBox from "../components/DataBox.jsx"
import urlDomain from '../components/Url.jsx';
import Footer from '../components/Footer.jsx'

import GameLogic from '../logic/game'
import User from '../logic/user'





export default function Home() {
  const navigate = useNavigate();
  const [onlyc, setOnlyc] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [msgBox, setMsgBox] = React.useState({ title: "", content: "" });
  const [datOpen, setdatOpen] = React.useState(false);
  const [datBox, setDatBox] = React.useState({ title: "提示", content: "请输入要加入的房间ID", });


  const handleClose = () => {
    setOpen(false);
    if (onlyc) {
      setOnlyc(false);
      return;
    }
    if (!User.auth) {
      navigate('/login');
    }
  }

  const modeA = () => {
    GameLogic.init();
    navigate("/game") //直接加入游戏
  }

  const modeB = async () => {
    if (!User.auth) {
      setMsgBox({ title: "错误", content: "请先登陆再创建房间！" });
      setOpen(true);
      return;
    }
    let url = `http://${urlDomain}/room/create?info=${base64.encode(JSON.stringify(User.info))}`;
    let result = await fetch(url)
    let data = await result.json();
    if (data.mode == 0) {
      setMsgBox({ title: "错误", content: "创建房间失败，请稍后再试！" });
      setOpen(true);
      return;
    }

    else if (data.mode == 1) {
      GameLogic.init();
      GameLogic.gameInfo.sign = 1; //房主默认下黑棋
      GameLogic.gameInfo.room = data.room;
      GameLogic.gameMode = 1;
      navigate("/game");
    }

  }

  const modeC = () => {
    if (!User.auth) {
      setMsgBox({ title: "错误", content: "请先登陆再加入房间！" });
      setOpen(true);
      return;
    }

    setdatOpen(true);
  }

  const modeD = () => {
    setOnlyc(true);
    setdatOpen(true);
  }


  const confirmJoin = async () => {
    setdatOpen(false);
    let room = {
      id: document.getElementById('roomID').value
    }
    //处理进入的在线房间的模式
    if (onlyc) { //如果是观战模式
      //观战模式
      let url = `http://${urlDomain}/room/read?room=${base64.encode(JSON.stringify(room))}`;
      let result = await fetch(url)
      let retdata = await result.json();
      if (retdata.mode == 1) {//判断该房间是否存在
        if (retdata.room.status == 1) {//判断是否可以观战
          setMsgBox({ title: "错误", content: "该房间已关闭" });
          setOpen(true);
          return;
        } else if (retdata.room.users.length != 2) {
          setMsgBox({ title: "错误", content: "该房间对局还未开始捏" });
          setOpen(true);
          return;
        }
        //全部满足则进行观战
        GameLogic.init();
        GameLogic.gameInfo.room = retdata.room; //传递房间号
        GameLogic.gameMode = 2; //设置为观战模式
        setOnlyc(false);  
        navigate("/game");
      } else { //房间不存在
        setMsgBox({ title: "错误", content: "该房间不存在" });
        setOpen(true);
        return;
      }


    } else { //反之则是对战模式

      let url = `http://${urlDomain}/room/join?info=${base64.encode(JSON.stringify(User.info))}&room=${base64.encode(JSON.stringify(room))}`;
      let result = await fetch(url)
      let retdata = await result.json();
      if (retdata.mode == 1) {
        if (retdata.room.status == 1) {
          setMsgBox({ title: "错误", content: "该房间已关闭" });
          setOpen(true);
          return;
        }

        GameLogic.init();
        if (retdata.room.users[0].id == User.info.id)
          GameLogic.gameInfo.sign = 1; //确定玩家的先后手 
        else
          GameLogic.gameInfo.sign = -1;
        GameLogic.gameInfo.room = retdata.room; //传递房间号
        GameLogic.gameMode = 1;  //设置为操作模式
        navigate("/game"); //放出棋盘
      } else {
        setMsgBox({ title: "错误", content: "加入房间失败，请稍后再试" });
        setOpen(true);
        return;
      }
    }
  }

  const cancelJoin = () => {
    setdatOpen(false);
  }


  return (


    <Box>
      <MessageBox title={msgBox.title} content={msgBox.content} open={open} onClick={handleClose} />

      <DataBox title={datBox.title} content={datBox.content} open={datOpen} onCancel={cancelJoin} onConfirm={confirmJoin} textlabel="ID" texttype="number" />

      <Stack sx={{ marginTop: 15, marginBottom: 15 }} direction="column" spacing={10} justifyContent="center" alignItems="center">

        <Button onClick={modeA} variant="contained">本地双人对战</Button>

        <Button onClick={modeB} variant="contained">创建在线房间</Button>

        <Button onClick={modeC} variant="contained">加入在线房间</Button>

        <Button onClick={modeD} variant="contained">在线观战</Button>
      </Stack>

      <Footer />
    </Box >



  );

}