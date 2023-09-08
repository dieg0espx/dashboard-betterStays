import React, { useEffect } from 'react'
import { auth, provider } from '../Firebase';
import {signInWithPopup} from "firebase/auth"
import { getFirestore, collection, query, getDocs, setDoc } from 'firebase/firestore';
import { app } from '../Firebase';
import { doc, getDoc } from "firebase/firestore";
import Cookies from 'js-cookie';


function Login(props) {
    
    const db = getFirestore(app);

    useEffect(()=>{
        checkCurrentUser()
    })

    async function checkCurrentUser(){
        if(localStorage.getItem('user')){
            const docRef = doc(db, "Users", localStorage.getItem('user'));
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                props.var(true)
            }
        }
    }

    async function googleAuth(){
        signInWithPopup(auth, provider).then(async (data)=>{
            try {
              const q = query(collection(db, "Users"));
              const querySnapshot = await getDocs(q);
              querySnapshot.forEach((doc) => {
                if(doc.data().email == data.user.email){
                    Cookies.set('access', true);
                    props.var(true)
                }
              });
            } catch (error) {
                console.error('Error fetching documents:', error);
            }
      })
    //   alert("User Not Found")

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