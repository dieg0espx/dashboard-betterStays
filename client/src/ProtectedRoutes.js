import { Outlet, useSearchParams } from "react-router-dom";
import Login from "./pages/Login";
import { useEffect, useState } from "react";


function ProtectedRoutes() {

    const [access, setAccess] = useState(false)

    const useAuth = () => {
        const user = {loggedIn: access};
       
        return user && user.loggedIn;
    };


    const isAuth = useAuth()

    return isAuth? <Outlet /> : <Login var={(e)=>setAccess(e)}/>
}

export default ProtectedRoutes;