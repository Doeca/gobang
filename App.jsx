import React from 'react'
import ReactDOM from "react-dom/client";
import {
    HashRouter,
    Routes,
    Route,
    Outlet
} from "react-router-dom";

import Register from "./pages/Register.jsx"
import Login from "./pages/Login.jsx"
import Home from "./pages/Home.jsx"
import Game from "./pages/Game.jsx"
import Appbar from './components/Appbar.jsx';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

const root = ReactDOM.createRoot(
    document.getElementById("root")
);

root.render(
    <HashRouter>
        <Container maxWidth="md">
            <Appbar />
            <CssBaseline />
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="game" element={<Game />} />
            </Routes>
        </Container>
    </HashRouter>
);