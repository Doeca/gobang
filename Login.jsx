import * as React from 'react';
import { Link as RouterLink, useNavigate, } from "react-router-dom";

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import MessageBox from "../components/MessageBox.jsx"
import Footer from '../components/Footer.jsx'
import User from '../logic/user';




export default function Login() {
  let navigate = useNavigate();
  const [msgBox, setMsgBox] = React.useState({ title: "", content: "" });
  const [open, setOpen] = React.useState(false);
  const handleClose = (event) => {
    event.preventDefault();
    if (User.auth) {
      navigate('/');
    } else
      setOpen(false);

  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    User.login(data.get('username'), data.get('password'), setOpen, setMsgBox)

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
        账户登陆
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="用户名"
          name="username"
          autoComplete="username"
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="密码"
          type="password"
          id="password"
          autoComplete="current-password"
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          登陆
        </Button>

        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link component={RouterLink} to="/register" variant="body2">
              {"没有账户？   点此注册！"}
            </Link>
          </Grid>
        </Grid>


      </Box>
      <Footer />
    </Box>
  );


}
