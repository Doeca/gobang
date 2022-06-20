//show the runing situation
import * as React from 'react';
import Typography from '@mui/material/Typography';
import urlDomain from '../components/Url.jsx';


function Footer() {
    let [pnum, setNum] = React.useState(0);
    let url = `http://${urlDomain}/user/num`;
    fetch(url).then(res => res.json()).then(
        data => setNum(data.num)
    )
    return (
        <Typography variant="body2" color="text.secondary" align="center">
            {`注册人数：${pnum} 人`}
        </Typography>
    );
}


export default Footer;