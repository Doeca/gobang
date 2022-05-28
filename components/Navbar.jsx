import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import { Outlet, Link } from "react-router-dom";
export default function Navbar() {
    const [value, setValue] = React.useState(0);

    return (
        <Box sx={{ width: 500 }}>
            <Outlet />
            <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
            >

                <BottomNavigationAction label="首页" icon={<RestoreIcon />} component={Link} to="/home" />
                <BottomNavigationAction label="大厅" icon={<FavoriteIcon />}  component={Link} to="/register"/>
                <BottomNavigationAction label="我的" icon={<LocationOnIcon />} />
            </BottomNavigation>
        </Box>
    );
}