import React, { useEffect, useState, useRef } from 'react'
import Sidebar from '../components/Sidebar';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../Firebase';
import axios from 'axios';
import { saveAs } from 'file-saver';



function CustomersPage() {
    const [customers, setCustomers] = useState([])
    const [finding, setFinding] = useState('')
    const [showSideBar, setShowSideBar] = useState(false)
    const [currentCustomer, setCurrentCustomer] = useState([])
    const [urlToPrint, setUrlToPrint] = useState('')

    const storage = getStorage();
    const db = getFirestore(app);

    useEffect(()=>{
        getCustomers()
    },[])

    function getCustomers(){
        fetch('https://apis-betterstay.vercel.app/api/getAllCustomers')
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
        printContract( '/sheet1?id=' + docSnap.data().email + '&&print=false')
      } else {
        console.log("No such document!");
      }
    }
    
    function customerSelected(name, phone, email){
      setShowSideBar(true)
      getPhotoID(name, phone, email);
      getSignedContract(email)
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

    
  return (
    <div className='wrapper-customersPage'>
        <div>
            <Sidebar />
        </div>
        <div>
          <div className='top-nav'>
                <h2> Customers </h2>
                <input type="text" placeholder='Find Customer' onChange={(e)=>setFinding(e.target.value)}></input>
                <button> <i className="bi bi-search searchIcon"></i> </button>
          </div>
          <div className='customers-mainGrid'  style={{display: showSideBar? "grid":"block"}}>
            <div className='customers-list'>
              {customers.filter((customer) => customer.fullName && customer.email && customer.phone &&customer.fullName.includes(finding)).map((customer) => (
                  <div className='customers-row' key={customer.id} onClick={()=>customerSelected(customer.fullName, customer.phone, customer.email)}>
                    <p id='name'>{customer.fullName}</p>
                    <p>{formatPhoneNumber(customer.phone)}</p>
                    <p>{customer.email.length > 30 ? customer.email.substring(0, 30) + ' ...' : customer.email}</p>
                  </div>
              ))}
            </div>
            <div className='customer-sideBar' style={{display: showSideBar? "block":"none"}}>
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
                <iframe ref={iframeRef} src={urlToPrint} />
            </div>
          </div>
        </div>
    </div>
  )
}

export default CustomersPage