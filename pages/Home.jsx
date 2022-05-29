import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { Outlet, Link as RouterLink } from "react-router-dom";
import Appbar from '../components/Appbar.jsx';
import { maxWidth, maxHeight } from '@mui/system';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';


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

  return (

    <Container maxWidth="md">
      <Appbar />
      <CssBaseline />
      <Outlet />

      <Box>
        <Stack sx={{ marginTop: 5, marginBottom: 10 }} direction="column" spacing={5} justifyContent="center" alignItems="center">
          <item>
            <Button variant="contained">Contained</Button>
          </item>
          <item>
            <Button variant="contained">Contained</Button>
          </item>
          <item>
            <Button variant="contained">Contained</Button>
          </item>
        </Stack>
      </Box>

      <Copyright />
    </Container>
  );

}