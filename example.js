import { initializeApp } from "firebase/app";
export const firebaseConfig = {
  apiKey: "AIzaSyBxItFltQlcaFl5OqDlSyQbX1BuEXieVnY",
  authDomain: "betterstay-33577.firebaseapp.com",
  projectId: "betterstay-33577",
  storageBucket: "betterstay-33577.appspot.com",
  messagingSenderId: "132048561469",
  appId: "1:132048561469:web:46b87f20cabbcf61751154"
};

const app = initializeApp(firebaseConfig);
import {doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";


export default async function handler(req, res) {

  const db = getFirestore(app);
  const tokenRef = doc(db, "token", "token");
  const docSnap = await getDoc(tokenRef);
  let token;
  if (docSnap.exists()) {
      token = docSnap.data().token;
  } else {
    console.log("TOKEN NOT FOUND IN FIREBASE");
  }
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        timeout: '50000',
        authorization: 'Bearer ' + token
      }
    };
    try {
      let response;
      fetch('https://open-api.guesty.com/v1/listings', options)
      .then(response => response.json())
      .then(response=>{
        if(response.error){
          console.log("Get New Token");
          fetch('https://api-token-diegotruezenith.vercel.app/api/getToken');
          res.status(200).json("reload")
        } else {
          res.status(200).json({response})
        }
      })
      
    } catch (error) {
      console.error(error);
    }
}