import React, { useEffect, useState, useRef } from 'react'
import Sidebar from '../components/Sidebar';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, getDoc, collection, addDoc, query, getDocs, } from 'firebase/firestore';
import { app } from '../Firebase';
import axios from 'axios';
import { saveAs } from 'file-saver';


function CustomersPage() {
    const apiURL = process.env.REACT_APP_APIURL;
    const mailerURL = process.env.REACT_APP_MAILERURL;

    const [customers, setCustomers] = useState([])
    const [finding, setFinding] = useState('')
    const [showSideBar, setShowSideBar] = useState(false)
    const [currentCustomer, setCurrentCustomer] = useState([])
    const [urlToPrint, setUrlToPrint] = useState('')
    const [haveSigned, setHaveSigned] = useState(false)

    const [myInvoices, setMyInvoices] = useState([])

    const [invoiceTitle, setInvoiceTitle] = useState('')
    const [InvoiceDescription, setInvoiceDescription] = useState('')
    const [invoiceAmount, setInvoiceAmount] = useState('');
    const [invoiceDestinatary, setInvoiceDestinatary] = useState('')

    const [isMobile, setIsMobile] = useState(false)


    const storage = getStorage();
    const db = getFirestore(app);

    function formatDate(date) {
      const formattedDate = new Intl.DateTimeFormat('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }).format(date);
    
      return formattedDate;
    }

    useEffect(()=>{
        getCustomers()
        if(window.innerWidth < 500){
          setIsMobile(true)
        }
    },[])

    function getCustomers(){
        fetch(apiURL + '/api/getAllCustomers')
        .then(response => response.json())
        .then(response => {
            const sortedCustomers = response.results
            .sort((a, b) => a.fullName?.localeCompare(b.fullName));
            setCustomers(sortedCustomers);
        })
    }
    
    function formatPhoneNumber(phoneNumber) {
        const cleaned = ('' + phoneNumber).replace(/\D/g, ''); // Remove non-numeric characters
        if (cleaned.length > 10) {
          return cleaned.replace(/^(\d{1,4})(\d{3})(\d{3})(\d{4})$/, '+$1 ($2) $3-$4');
        }
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
          return '(' + match[1] + ') ' + match[2] + '-' + match[3];
        }
        return phoneNumber; 
    }

    function getPhotoID(name, phone, email){
      getDownloadURL(ref(storage, '/customersID/' + email))
      .then((url) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = (event) => {
          const blob = xhr.response;
        };
        xhr.open('GET', url);
        xhr.send();
        setCurrentCustomer({name: name, phone:phone, email:email, imageID:url})
      })
      .catch((error) => {
        setCurrentCustomer({name: name, phone:phone, email:email, imageID:''})
      });
    }

    async function getSignedContract(email){
      const docRef = doc(db, "documents", email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        printContract( '/sheet1?id=' + email + '&&print=false')
        setHaveSigned(true)
      } else {
        setHaveSigned(false)
      }
    }
    
    function customerSelected(name, phone, email){
      setShowSideBar(true)
      getPhotoID(name, phone, email);
      getSignedContract(email)
      getMyInvoices(email)
    }

    const iframeRef = useRef(null);
    function printContract(url){
      if(url == urlToPrint) {
        iframeRef.current.contentWindow.location.reload();
      } else {
        setUrlToPrint(url)
      }
    }

    function downloadPhotoID(imageURL, fileName){
        saveAs(imageURL,fileName);
    }

    async function createNewInvoice(){
     const docRef =  await addDoc(collection(db, "Invoices"), {
        title: invoiceTitle, 
        description: InvoiceDescription, 
        name: currentCustomer.name, 
        phone: currentCustomer.phone,
        email: currentCustomer.email, 
        amount: invoiceAmount,
        destinatary: invoiceDestinatary,
        paid:false,
        date:  formatDate(new Date())
      });

  

      //sending Email  
      console.log("Sending Email ...");
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
      var urlencoded = new URLSearchParams();
      urlencoded.append("invoiceID", docRef.id);
      urlencoded.append("email", currentCustomer.email);
      urlencoded.append("title", invoiceTitle);
      urlencoded.append("description", InvoiceDescription);
      urlencoded.append("amount", invoiceAmount);
     
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

      alert("Invoice Sent to: " + currentCustomer.email)

      setInvoiceTitle('');
      setInvoiceDescription('');
      setInvoiceAmount('');
      setInvoiceDestinatary('')
      getMyInvoices(currentCustomer.email)
    }


    async function getMyInvoices(customerEmail){
      try {
        const q = query(collection(db, "Invoices"));
        let data = []
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          if(doc.data().email == customerEmail){
            data.push({
              id:doc.id,
              title: doc.data().title, 
              description: doc.data().description, 
              amount: doc.data().amount, 
              date: doc.data().date,
              paid: doc.data().paid
            })
          }
        });
        setMyInvoices(data)
        } catch (error) {
          console.error('Error fetching documents:', error);
        }
    }




    
  return (
    <div className='wrapper-customersPage'>
        <div>
            <Sidebar />
        </div>
        <div>
          <div className='top-nav'>
                <h2> Customers </h2>
                <div className='searchBar'>
                  <input type="text" placeholder='Find Customer' onChange={(e)=>setFinding(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1).toLowerCase())}></input>
                  <button> <i className="bi bi-search searchIcon"></i> </button>
                </div>
          </div>
          <div className='customers-mainGrid'  style={{display: showSideBar? "grid":"block"}}>
            <div className='customers-list'>
              {customers.filter((customer) => customer.fullName && customer.email && customer.phone &&customer.fullName.includes(finding)).map((customer) => (
                  <div className='customers-row' key={customer.id} onClick={()=>customerSelected(customer.fullName, customer.phone, customer.email)}>
                    <i style={{display: isMobile? "block":"none"}} className="bi bi-person-circle iconPerson"></i>
                    <p id='name'>{customer.fullName}</p>
                    <p>{formatPhoneNumber(customer.phone)}</p>
                    <p id='email'>{customer.email.length > 30 ? customer.email.substring(0, 30) + ' ...' : customer.email}</p>                    
                  </div>
              ))}
            </div>
            <div className='customer-sideBar' style={{display: showSideBar? "block":"none"}}>
                <button className='backIcon' onClick={()=>setShowSideBar(false)}> <i className="bi bi-chevron-left "></i> Back </button>
                <p id="name"> {currentCustomer.name}  </p>
                <p id="phone"> <i className="bi bi-telephone"></i> {formatPhoneNumber(currentCustomer.phone)} </p>
                <p id="email"> <i className="bi bi-envelope"></i> {currentCustomer.email}</p> 
                <p id="checkPhotoID"> 
                  <i className={currentCustomer.imageID !== "" ? "bi bi-check-circle-fill checkIcon":"bi bi-exclamation-circle-fill warningIcon"}></i> 
                  Picture ID 
                  <i className="bi bi-download iconDownload" onClick={()=>downloadPhotoID(currentCustomer.imageID, currentCustomer.name)}> Save </i>
                </p> 
                <img id="customerID" style={{display: currentCustomer.imageID !== "" ? "block":"none" }} src={currentCustomer.imageID} />     
                <p id="checkSignedContract"> 
                  <i className={currentCustomer.imageID !== "" ? "bi bi-check-circle-fill checkIcon":"bi bi-exclamation-circle-fill warningIcon"}></i>
                  Signed Contract 
                  <i className="bi bi-printer iconPrint" onClick={()=>printContract('/sheet1?id=' + currentCustomer.email + '&&print=true')}> Print </i>
                </p> 
                <iframe ref={iframeRef} src={urlToPrint} style={{display : haveSigned ? "block":"none" }}/>
                <div className='extraInvoice'>
                  <p> <i className="bi bi-receipt"></i> New Invoice </p>
                  <input type='text' placeholder='Invoice Title' onChange={(e)=>setInvoiceTitle(e.target.value)} value={invoiceTitle}/>
                  <textarea rows={10} placeholder='Description' onChange={(e)=>setInvoiceDescription(e.target.value)} value={InvoiceDescription}/>
                  <input type='tel' placeholder='Amount' onChange={(e)=>setInvoiceAmount(e.target.value)} value={invoiceAmount} />
                  <select onChange={(e)=>setInvoiceDestinatary(e.target.value)} value={invoiceDestinatary}> 
                    <option value="" disabled>Destinatary:</option>
                    <option> DAVID </option>
                    <option> PJ INVESTMENTS </option>
                    <option> PHILL </option>
                    <option> RC HOMES </option>
                    <option> ROCK CITY HOMES </option>
                  </select>
                  <button onClick={()=>createNewInvoice()}> Send </button>
                </div>
                <div className='myInvoices'>
                    {myInvoices.map(invoice => (
                      <div className='myInvoices-row' key={invoice.id} onClick={()=>window.location.href="/invoice?id=" + invoice.id}>
                        <i className={invoice.paid ? "bi bi-check-circle-fill checkIcon":"bi bi-exclamation-circle-fill warningIcon"}></i> 
                        <p> {invoice.date} </p>
                        <p id="amount"> ${invoice.amount} </p>
                      </div>      
                    ))}
                </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default CustomersPage