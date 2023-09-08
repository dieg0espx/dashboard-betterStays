import { Outlet, useSearchParams } from "react-router-dom";
import Login from "./pages/Login";
import Cookies from 'js-cookie';
import { useEffect, useState } from "react";


function ProtectedRoutes() {

    const [access, setAccess] = useState(false)
    useEffect(()=>{
        console.log(Cookies.get('access'));
    },[Cookies.get('access')])

    const useAuth = () => {
        const user = {loggedIn:Cookies.get('access')};
       
        return user && user.loggedIn;
    };


    const isAuth = useAuth()

    return isAuth? <Outlet /> : <Login var={(e)=>setAccess(e)}/>
}

export default ProtectedRoutes;