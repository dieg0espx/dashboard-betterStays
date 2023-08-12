import React, { useState, useEffect } from 'react'
import { app } from '../Firebase.js';
import { doc, setDoc, getDoc, getFirestore } from "firebase/firestore"; 
import { useLocation, useSearchParams } from 'react-router-dom';
import StripeContainer from '../components/StripeContainer.js';

function Invoice() {
    const db = getFirestore(app);
    const location = useLocation();
    const {search } = location;
    const params = new URLSearchParams(search);
    
    const [invoice, setInvoice] = useState([])

    useEffect(()=>{
      getData(params.get('id'));
    },[])

    async function getData(invoiceID) {
        try {
          const docRef = doc(db, "Invoices", invoiceID);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setInvoice(docSnap.data());
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
    }



  return (
    <div className='wrapper-invoicePage'>
        <div className='content'>
            <img src='https://res.cloudinary.com/dxfi1vj6q/image/upload/v1682964660/Final_Logo_1_byrdtx.png' />
            <p id="title"> {invoice.title}</p>
            <p id="description"> {invoice.description}</p>
            <p id="date"> {invoice.date}</p>
            <StripeContainer balance={invoice.amount}/>
        </div>
    </div>
  )
}

export default Invoice
