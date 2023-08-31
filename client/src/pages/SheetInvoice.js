import React, { useState, useEffect } from 'react'
import { app } from '../Firebase.js';
import { doc, setDoc, getDoc, getFirestore, updateDoc } from "firebase/firestore"; 
import { useLocation, useSearchParams } from 'react-router-dom';
import StripeContainer from '../components/StripeContainer.js';

function SheetInvoice() {
    const db = getFirestore(app);
    const location = useLocation();
    const {search } = location;
    const params = new URLSearchParams(search);
    
    const [invoice, setInvoice] = useState([])
    const [paid, setPaid] = useState(false)
    const [invoiceID, setInvoiceID] = useState('')


    useEffect(()=>{
      getData(params.get('id'));
    },[])

    async function getData(idURL) {
        setInvoiceID(idURL)
        try {
          const docRef = doc(db, "Invoices", idURL);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setInvoice(docSnap.data());
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
    }

    useEffect(()=>{
        if(invoiceID){
            window.print()
        }
    },[invoice])



  return (
    <div className='wrapper-sheetInvoice'>    
        <img src='https://res.cloudinary.com/dxfi1vj6q/image/upload/v1682964660/Final_Logo_1_byrdtx.png' />
        
        <div className='two-col'>
            <div>
                <h2> INVOICE </h2>
                <p id="id" > {invoiceID} </p>
            </div>
            <div>
                <p id="name" > {invoice.name}  </p>
                <p id="phone"> {invoice.phone} </p>
                <p id="email"> {invoice.email} </p>
            </div>
        </div>
        
        <p id="title"> {invoice.title}</p>
        <p id="description"> {invoice.description}</p>
        <p id="date"> <b> Issued: </b>{invoice.date}</p>
        <p id="amount"><b> Total: </b> ${invoice.amount} USD </p>
    </div>
  )
}

export default SheetInvoice 
