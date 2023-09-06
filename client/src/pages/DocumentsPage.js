import React, { useState, useRef, useEffect, useLocation } from 'react';
import Sidebar from '../components/Sidebar';
import { getFirestore, collection, query, getDocs, setDoc } from 'firebase/firestore';
import { app } from '../Firebase';
import { doc, getDoc, addDoc, updateDoc } from "firebase/firestore";

function DocumentsPage() {
  const db = getFirestore(app);
  const [documents, setDocuments] = useState([]);
  const [finding, setFinding] = useState('')
  const [urlToPrint, setUrlToPrint] = useState('')
  const [showEdits, setShowEdits] = useState(false)
  const [docStatus, setDocStatus] = useState('available')

  const [isMobile, setIsMobile] = useState(false)



  useEffect(() => {
    getDocuments();
    if(window.innerWidth < 500){
      setIsMobile(true)
    }
  }, []);

  async function getDocuments(){
    try {
      const q = query(collection(db, "Documents"));
      let data = []
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.id);
        data.push({id: doc.id, title:doc.data().title, nameTenant1:doc.data().nameTenant1, nameTenant2:doc.data().nameTenant2, checkIn: doc.data().input[20], date: doc.data().date, sign: doc.data().sign, email:doc.data().email, status:doc.data().status })
      });
      setDocuments(data)
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
  }

  const iframeRef = useRef(null);
  function printOrder(url){
    if(url == urlToPrint) {
      iframeRef.current.contentWindow.location.reload();
    } else {
      setUrlToPrint(url)
    }
  }

  async function setDocToArchive(id){
    const docRef = doc(db, "Documents", id);
    await updateDoc(docRef, {
      status: 'archive'
    });
    getDocuments()
  }

  async function setArchiveToDoc(id){
    const docRef = doc(db, "Documents", id);
    await updateDoc(docRef, {
      status: 'available'
    });
    getDocuments()
  }

  async function createContract(){
    const inputsArray = [];
    for(let i = 0; i < 60; i++){
      inputsArray.push(i);
    }
    console.log(inputsArray);

    const radiosArray = Array(42).fill(false);
    await addDoc(collection(db, "Documents"), {
      date: formatDate(new Date()),
      input: inputsArray,
      nameLandlord: "", 
      nameTenant1: "", 
      nameTenant2: "",
      radios:radiosArray, 
      signLandlord: "", 
      signTenant1: "",
      signTenant2: "",
      title: "", 
      status: "available"
    });
  }

  function formatDate(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }


  return (
    <div className="wrapper-documentsPage">
      <div>
        <Sidebar />
        <iframe ref={iframeRef} src={urlToPrint} />
      </div>
      <div>
        <div className="top-nav">
          <h2> {docStatus == 'archive' ? "Archive":"Documents"} </h2>
          <div className='searchBar'>
              <input type="text" placeholder='Find Customer' onChange={(e)=>setFinding(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1).toLowerCase())}></input>
              <button> <i className="bi bi-search searchIcon"></i> </button>
              <i class="bi-file-earmark-plus editIcon" onClick={()=>createContract()}></i>
              <i class="bi bi-archive editIcon" onClick={docStatus =='available' ? ()=>setDocStatus('archive'):()=>setDocStatus('available')}></i>
              <i class="bi bi-sliders editIcon" onClick={()=>setShowEdits(!showEdits)}></i>
          </div>
        </div>
          {documents
            .filter((application) => application.status === docStatus)
            .map((application) => (
              <div className='documents-row' key={application.id}>
                <div id="left" onClick={() => printOrder('/sheet1?id=' + application.id + '&&print=true')}>
                  <i className="bi bi-file-text iconDocument" style={{ display: isMobile ? 'block' : 'none' }}></i>
                  <p id="name">{application.nameTenant1}</p>
                  <p id="id">{application.id}</p>
                  <p id="title" style={{ display: isMobile ? 'none' : 'block' }}>{application.title}</p>
                  <p id="title" style={{ display: isMobile ? 'block' : 'none' }}>{application.title} - {application.date}</p>
                  <p style={{ display: isMobile ? 'none' : 'block' }}>{application.date}</p>
                  <i style={{ display: isMobile ? 'none' : 'block' }} className="bi bi-chevron-right iconChevRight"></i>
                </div>
                <div id="right" style={{ display: showEdits ? 'flex' : 'none' }}>
                  <i className="bi bi-pencil-square writeIcon" onClick={() => window.location.href = '/document?id=' + application.id}></i>
                  <i style={{display: docStatus == 'archive' ?  "none":"block"}}className="bi bi-archive writeIcon" onClick={() => setDocToArchive(application.id)}></i>
                  <i style={{display: docStatus == 'archive' ?  "block":"none"}}className="bi bi-recycle writeIcon" onClick={() => setArchiveToDoc(application.id)}></i>
                </div>
              </div>
            ))
          }
      </div>
    </div>
  );
}

export default DocumentsPage;
