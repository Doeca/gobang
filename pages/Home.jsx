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

import GameLogic from '../logic/game'
import User from '../logic/user'



function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


export default function Home() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [msgBox, setMsgBox] = React.useState({ title: "", content: "" });
  const [datOpen, setdatOpen] = React.useState(false);
  const [datBox, setDatBox] = React.useState({ title: "提示", content: "请输入要加入的房间ID", });


  const handleClose = () => {
    setOpen(false);
    if (!User.auth) {
      navigate('/login');
    }
  }

  const modeA = () => {
    GameLogic.init();
    navigate("/game")
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


  const confirmJoin = async () => {

    setdatOpen(false);
    let room = {
      id: document.getElementById('roomID').value
    }
    console.log(room);

    let url = `http://${urlDomain}/room/join?info=${base64.encode(JSON.stringify(User.info))}&room=${base64.encode(JSON.stringify(room))}`;
    console.log(url);
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
        GameLogic.gameInfo.sign = 1;
      else
        GameLogic.gameInfo.sign = -1;
      GameLogic.gameInfo.room = retdata.room;
      GameLogic.gameMode = 1;
      navigate("/game");
    } else {
      setMsgBox({ title: "错误", content: "加入房间失败，请稍后再试" });
      setOpen(true);
      return;
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

        <Button onClick={modeA} variant="contained">单机双人对战</Button>

        <Button onClick={modeB} variant="contained">创建在线房间</Button>

        <Button onClick={modeC} variant="contained">加入在线房间</Button>

      </Stack>
      <Copyright />

    </Box >



  );

}