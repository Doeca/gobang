import React from 'react'
import ReactDOM from "react-dom/client";
import {
    HashRouter,
    Routes,
    Route
} from "react-router-dom";

import Register from "./pages/Register.jsx"
import Login from "./pages/Login.jsx"
import Home from "./pages/Home.jsx"
import Game from "./pages/Game.jsx"
const root = ReactDOM.createRoot(
    document.getElementById("root")
);

root.render(
    <HashRouter>
        <Routes>
            <Route path="/" element={<Game />}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route
                    path="*"
                    element={
                        <main style={{ padding: "1rem" }}>
                            <p>There's nothing here!</p>
                        </main>
                    }
                />
            </Route>
        </Routes>
    </HashRouter>
);