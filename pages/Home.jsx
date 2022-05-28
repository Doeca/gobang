import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { Outlet, Link } from "react-router-dom";
import Appbar from '../components/Appbar.jsx';

export default function Home() {

  return (
    <Container maxWidth="sm">
     <CssBaseline  />
        <Appbar />
        <Outlet />

    </Container>
  );

}