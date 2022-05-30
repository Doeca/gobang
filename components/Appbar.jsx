import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CssBaseline from '@mui/material/CssBaseline';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AlbumIcon from '@mui/icons-material/Album';
import User from "../logic/user.js"
import { Link } from "react-router-dom";



export default function Appbar() {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleChange = (event) => {
        setAuth(event.target.checked);
    };
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () =>{
        User.logout();
        setAnchorEl(null);
    }

    return (
        <Box sx={{ flexGrow: 1 }} >
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        sx={{ mr: 2 }}
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        color="inherit"
                        component={Link}
                        to="/"
                    >
                        <AlbumIcon />
                    </IconButton>


                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        棋魂
                    </Typography>
                    <div>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>

                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            {User.auth
                                ? <MenuItem onClick={handleLogout} component={Link} to="/">注销</MenuItem>
                                : <MenuItem onClick={handleClose} component={Link} to="/login">登陆</MenuItem>
                            }

                        </Menu>
                    </div>

                </Toolbar>
            </AppBar>
        </Box >
    );
}