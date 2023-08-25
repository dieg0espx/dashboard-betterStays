import React, { useState, useEffect } from 'react'
import { app } from '../Firebase.js';
import { doc, setDoc, getDoc, getFirestore, updateDoc } from "firebase/firestore"; 
import { useLocation, useSearchParams } from 'react-router-dom';
import StripeContainer from '../components/StripeContainer.js';

function Invoice() {
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
        if (invoice.paid == true) {
          setPaid(true)
        } else {
          setPaid(false)
        }
    },[invoice])



  return (
    <div className='wrapper-invoicePage'>
        <div className='content'>
            <img src='https://res.cloudinary.com/dxfi1vj6q/image/upload/v1682964660/Final_Logo_1_byrdtx.png' />
            <div className='horizontal-divider'/>

            <div className='details'>
              <div id="left">
                <p id="title"> {invoice.title}</p>
                <p id="description"> {invoice.description}</p>
                <p id="date"> <b> Issued: </b>{invoice.date}</p>
              </div>
              <div> 
                  <p id="amount"> ${invoice.amount} USD </p>
                  <p id="name">  <i className="bi bi-check-circle-fill bulletIcon"></i> {invoice.name} </p>
                  <p id="phone"> <i className="bi bi-check-circle-fill bulletIcon"></i> {invoice.phone} </p>
                  <p id="email"> <i className="bi bi-check-circle-fill bulletIcon"></i> {invoice.email} </p>
                  <StripeContainer className="stripeContainer" balance={invoice.amount} paid={paid} invoiceID={invoiceID} />
              </div>
            </div>
        </div>
       
    </div>
  )
}

export default Invoice
