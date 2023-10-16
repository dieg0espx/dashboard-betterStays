import React, { useState, useEffect, useRef } from 'react'
import { app } from '../Firebase.js';
import { doc, setDoc, getDoc, getFirestore, updateDoc } from "firebase/firestore"; 
import { useLocation, useSearchParams } from 'react-router-dom';
import StripeContainer from '../components/StripeContainer.js';

function Invoice() {
    const apiURL = process.env.REACT_APP_APIURL;
    const mailerURL = process.env.REACT_APP_MAILERURL;
    const db = getFirestore(app);
    const location = useLocation();
    const {search } = location;
    const params = new URLSearchParams(search);
    
    const [invoice, setInvoice] = useState([])
    const [paid, setPaid] = useState(false)
    const [invoiceID, setInvoiceID] = useState('')

    const [sheetURL, setSheetURL] = useState('')
    const [showPopup, setShowPopup] = useState(false)

    const [recipentEmail, setRecipentEmail] = useState('')

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

    const iframeRef = useRef(null);
    function printInvoice(url){
      if(url == sheetURL){
        iframeRef.current.contentWindow.location.reload();
      } else {
        setSheetURL(url)
      }
    }

    function sendInvoice(){
      //sending Email  
      console.log("Sending Email ...");
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
      var urlencoded = new URLSearchParams();
      urlencoded.append("invoiceID", invoiceID);
      urlencoded.append("email", recipentEmail);
      urlencoded.append("title", invoice.title);
      urlencoded.append("description", invoice.description);
      urlencoded.append("amount", invoice.amount);
     
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
      };
      
      fetch(mailerURL + "/api/newInvoice", requestOptions)
        .then(response => response.text())
        .then(result => console.log("Email Sent: " + result))
        .catch(error => console.log('== ERROR === ', error));
        
      alert("Invoice Sent to: " + recipentEmail)
      setRecipentEmail('')
      setShowPopup(false)
    }


  return (
    <div className='wrapper-invoicePage'> 
        <div className='content'>
            <img src='https://res.cloudinary.com/dxfi1vj6q/image/upload/v1682964660/Final_Logo_1_byrdtx.png' />
            <div className='horizontal-divider'/>
            <div className='details'>
              <div id=" left">
                <p id="title"> {invoice.title}</p>
                <p id="description"> {invoice.description}</p>
                <p id="date"> <b> Issued: </b>{invoice.date}</p>
              </div>
              <div> 
                  <p id="amount"> ${invoice.amount} USD </p>
                  <p id="name">  <i className="bi bi-check-circle-fill bulletIcon"></i> {invoice.name} </p>
                  <p id="phone"> <i className="bi bi-check-circle-fill bulletIcon"></i> {invoice.phone} </p>
                  <p id="email"> <i className="bi bi-check-circle-fill bulletIcon"></i> {invoice.email} </p>
                  <StripeContainer 
                    className="stripeContainer" 
                    balance={invoice.amount} 
                    paid={paid} 
                    invoiceID={invoiceID} 
                    title={invoice.title}
                    description={invoice.description}
                    name={invoice.name}
                    email={invoice.email}
                  />
              </div>
            </div>
        </div>
       <div className='floatingBtns'>
          <iframe src={sheetURL} ref={iframeRef}/>
          <button onClick={()=>setShowPopup(true)}> <i className="bi bi-send"></i>  </button>  
          <button onClick={()=>printInvoice('/sheetInvoice?id=' + invoiceID)}> <i className="bi bi-printer"></i> </button>
       </div>
       <div className='overlay' style={{display: showPopup? "block":"none"}} onClick={()=>setShowPopup(false)}></div>
       <div className='forward-popup' style={{display: showPopup? "block":"none"}}>
          <h2> Send Invoice </h2>
          <p> Enter recipients email address:  </p>
          <div className='form'>
            <input type='email' placeholder='example@mail.com' value={recipentEmail} onChange={(e) =>setRecipentEmail(e.target.value)}/>
            <button onClick={()=>sendInvoice()}> Send </button>
          </div>
       </div>
    </div>
  )
}

export default Invoice
