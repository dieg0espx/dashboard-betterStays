import React, { useEffect, useContext } from 'react'
import { auth, provider } from '../Firebase';
import {signInWithPopup} from "firebase/auth"
import { getFirestore, collection, query, getDocs, setDoc } from 'firebase/firestore';
import { app } from '../Firebase';
import { doc, getDoc } from "firebase/firestore";
import Cookies from 'js-cookie';
import { Context } from "../App";


function Login(props) {
    const [signedIn, setSignedIn] = useContext(Context)
    const db = getFirestore(app);
  


    async function googleAuth(){
      signInWithPopup(auth, provider).then(async (data)=>{
        try {
          const q = query(collection(db, "Users"));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            if(doc.data().email == data.user.email){
                setSignedIn(true)
            }
          });
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
      })
    }

  return (
    <div className='wrapper-login'>
        <div className='content'>
            <img src='https://res.cloudinary.com/dxfi1vj6q/image/upload/v1683933526/Final_Logo_1_byrdtx_m9colt.png'/>
            <button onClick={()=>googleAuth()}> Access </button>
        </div>
    </div>
  )
}

export default Login