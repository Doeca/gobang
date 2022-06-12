import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, useNavigate } from "react-router-dom";
import MessageBox from "../components/MessageBox.jsx"
import User from '../logic/user';
import Footer from '../components/Footer.jsx'

export default function Register() {
  let navigate = useNavigate();
  const [success, setSuccess] = React.useState(false);
  const [msgBox, setMsgBox] = React.useState({ title: "", content: "" });
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
    console.log(success);
    if (success)
      navigate('/login');
  };


  const textCheck = (username, pwd, pwd2, nick, setMsgBox) => {
    let u = false;
    if (/[a-zA-Z]{1}[0-9a-zA-Z_.@]{3,15}/.test(username) == false) {
      setMsgBox({ title: "错误", content: "用户名长度4-16位，必须字母开头，支持大小写字母及下划线" });
      u = true;
    }
    else if (/[0-9a-zA-Z_.@]{8,16}/.test(pwd) == false) {
      setMsgBox({ title: "错误", content: "密码长度8-16位，支持大小写字母及下划线" });
      u = true;
    } else if (pwd != pwd2) {
      setMsgBox({ title: "错误", content: "两次密码填写不一致" });
      u = true;
    }
    else if (nick == '') {
      setMsgBox({ title: "错误", content: "昵称不得为空" });
      u = true;
    }
    return u;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    let username = data.get('username');
    let pwd = data.get('password');
    let pwd2 = data.get('password2');
    let nick = encodeURIComponent(data.get('usernick'));

    if (textCheck(username, pwd, pwd2, nick, setMsgBox)) {
      setOpen(true);
      return;
    }

    User.register({ username: username, pwd: pwd, nick: nick }, setOpen, setMsgBox, setSuccess);
  };

  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >

      <MessageBox title={msgBox.title} content={msgBox.content} open={open} onClick={handleClose} />

      <Avatar sx={{ m: 2, bgcolor: 'secondary.main' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        账户注册
      </Typography>
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="given-name"
              name="username"
              required
              fullWidth
              id="username"
              label="用户名"
              autoFocus
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="usernick"
              label="昵称"
              name="usernick"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="password"
              label="密码"
              type="password"
              id="password"
              autoComplete="new-password"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="password2"
              label="确认密码"
              type="password"
              id="password2"
              autoComplete="new-password"
            />
          </Grid>

        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          注册
        </Button>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link component={RouterLink} to="/login" variant="body2">
              已经有账户了？  点此登陆！
            </Link>
          </Grid>
        </Grid>
       
      </Box>
      <Footer />
    </Box>

  );
}