import { Outlet, useSearchParams } from "react-router-dom";
import Login from "./pages/Login";
import Cookies from 'js-cookie';
import { useContext, useEffect, useState } from "react";


function ProtectedRoutes() {
    const [myToken, setMyToken] = useState(Cookies.get('token'))
    const [logged, setLogged] = useState(true)

    useEffect(()=>{
        if(process.env.REACT_APP_TOKEN == myToken){
             setLogged(true)
        } else {
            setLogged(false)
        }
    })

    return logged? <Outlet /> : <Login/>
    
}

export default ProtectedRoutes;
