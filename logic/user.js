import * as React from 'react';

export default function User() {
    const [auth, setAuth] = React.useState(false);

    const login = (act, pwd) => {
        //执行逻辑，如果登陆成功
        setAuth(true);
    }
    
}