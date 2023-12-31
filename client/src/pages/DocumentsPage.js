import React, { useState, useRef, useEffect, useLocation } from 'react';
import Sidebar from '../components/Sidebar';
import { getFirestore, collection, query, getDocs, setDoc } from 'firebase/firestore';
import { app } from '../Firebase';
import { doc, getDoc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";

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
        data.push({
          id: doc.id, 
          title:doc.data().title, 
          nameTenant1:doc.data().input[3], 
          nameTenant2:doc.data().nameTenant2, 
          checkIn: doc.data().input[1] + ', 20' + doc.data().input[2] , 
          date: doc.data().date, 
          sign: doc.data().sign, 
          email:doc.data().email, 
          status:doc.data().status, 
          address:doc.data().input[6], 
          propertyName: doc.data().propertyName,
          signTenant1: doc.data().signTenant1,
          signTenant2: doc.data().signTenant2,
          signLandlord: doc.data().signLandlord, 
        })
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
    alert("Document Archived Successfully !")
  }

  async function setArchiveToDoc(id){
    const docRef = doc(db, "Documents", id);
    await updateDoc(docRef, {
      status: 'available'
    });
    getDocuments()
    alert("Document Recovered Successfully !")
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

  async function deleteDocument(id){
      const result = window.confirm('Are you sure you want to delete?');
      if (result){
        await deleteDoc(doc(db, "Documents", id))
        await getDocuments()
      } else {
        console.log("Delete Canceled")
      }
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
              <div className={isMobile? "findBar":""}>
                <input type="text" placeholder='Find Customer' onChange={(e)=>setFinding(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1).toLowerCase())}></input>
                <button> <i className="bi bi-search searchIcon"></i> </button>
              </div>
              <i class="bi bi-archive editIcon" onClick={docStatus =='available' ? ()=>setDocStatus('archive'):()=>setDocStatus('available')}></i>
          </div>
        </div>
          {documents
            .filter((application) => application.status === docStatus)
            .map((application) => (
              <>
              <div className="documents-row" key={application.id} style={{display: isMobile? "none":"grid"}}>
              <p>{application.signTenant1 == '' ? <i className="bi bi-check-circle-fill notSigned"></i>: <i className="bi bi-check-circle-fill signed"></i>} {application.signTenant2 == '' ? <i className="bi bi-check-circle-fill notSigned"></i>: <i className="bi bi-check-circle-fill signed"></i>} {application.signLandlord == '' ? <i className="bi bi-check-circle-fill notSigned"></i>: <i className="bi bi-check-circle-fill signed"></i>}</p>
                    <p id="name">{application.title} </p>
                    <p id="id">{application.propertyName}</p>
                    <p id="title" style={{ display: isMobile ? 'none' : 'block' }}>{application.nameTenant1}</p>
                    <p id="title" style={{ display: isMobile ? 'block' : 'none' }}>{`${application.title} - ${application.date}`}</p>
                    <p style={{ display: isMobile ? 'none' : 'block' }}>{application.checkIn}</p>
                    <div className='actionBtns'>
                      <i className="bi bi-pencil-square writeIcon" onClick={() => window.location.href = `/document?id=${application.id}&&adminAccess=true`}></i>
                      <i style={{ display: docStatus === 'archive' ? 'none' : 'block' }} className="bi bi-archive writeIcon" onClick={() => setDocToArchive(application.id)}></i>
                      <i style={{ display: docStatus === 'archive' ? 'block' : 'none' }} className="bi bi-recycle writeIcon" onClick={() => setArchiveToDoc(application.id)}></i>
                      <i className="bi bi-trash writeIcon" onClick={() => deleteDocument(application.id)}></i>
                      <i className="bi bi-printer writeIcon" onClick={() => printOrder(`/sheet1?id=${application.id}&&print=true`)}></i>
                    </div>
              </div>
               <div className="mobile-documents-row" key={application.id} style={{display: isMobile? "grid":"none"}}>
                  <div>
                    <i className="bi bi-file-text iconDocument" style={{ display: isMobile ? 'block' : 'none' }}></i>
                  </div>
                  <div className='details'>
                      <div style={{display: 'flex', justifyContent:'space-between', alignItems:'center'}}>
                        <p>{application.propertyName} </p>
                        <p>{application.signTenant1 == '' ? <i className="bi bi-check-circle-fill notSigned"></i>: <i className="bi bi-check-circle-fill signed"></i>} {application.signTenant2 == '' ? <i className="bi bi-check-circle-fill notSigned"></i>: <i className="bi bi-check-circle-fill signed"></i>} {application.signLandlord == '' ? <i className="bi bi-check-circle-fill notSigned"></i>: <i className="bi bi-check-circle-fill signed"></i>}</p>
                      </div>  
                      <p>{application.nameTenant1}</p>
                      <p>{`${application.title} - ${application.date}`}</p>
                      <div className='actionBtns'>
                        <i className="bi bi-pencil-square writeIcon" onClick={() => window.location.href = `/document?id=${application.id}&&adminAccess=true`}></i>
                        <i style={{ display: docStatus === 'archive' ? 'none' : 'block' }} className="bi bi-archive writeIcon" onClick={() => setDocToArchive(application.id)}></i>
                        <i style={{ display: docStatus === 'archive' ? 'block' : 'none' }} className="bi bi-recycle writeIcon" onClick={() => setArchiveToDoc(application.id)}></i>
                        <i className="bi bi-trash writeIcon" onClick={() => deleteDocument(application.id)}></i>
                        <i className="bi bi-printer writeIcon" onClick={() => printOrder(`/sheet1?id=${application.id}&&print=true`)}></i>
                      </div>
                  </div>
              </div>
              </>
            ))
          }
      </div>
    </div>
  );
}

export default DocumentsPage;
