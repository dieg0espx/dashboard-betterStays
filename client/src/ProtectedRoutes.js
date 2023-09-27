import { Outlet, useSearchParams } from "react-router-dom";
import Login from "./pages/Login";
import Cookies from 'js-cookie';
import { useContext, useEffect, useState } from "react";
import { Context } from "./App";


function ProtectedRoutes() {
    // const [signedIn, setSignedIn] = useContext(Context)

    
    

    return true? <Outlet /> : <Login />
}

export default ProtectedRoutes;