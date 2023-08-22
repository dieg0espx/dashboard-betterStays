import React, { useState, useRef, useEffect, useLocation } from 'react';
import Sidebar from '../components/Sidebar';
import { getFirestore, collection, query, getDocs, setDoc } from 'firebase/firestore';
import { app } from '../Firebase';
import { doc, getDoc } from "firebase/firestore";

function DocumentsPage() {
  const db = getFirestore(app);
  const [documents, setDocuments] = useState([]);
  const [finding, setFinding] = useState('')
  const [urlToPrint, setUrlToPrint] = useState('')
  const [showEdits, setShowEdits] = useState(false)



  useEffect(() => {
    getDocuments();
  }, []);

  async function getDocuments(){
    try {
      const q = query(collection(db, "documents"));
      let data = []
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.id);
        data.push({id: doc.id, title:doc.data().title, nameTenant1:doc.data().nameTenant1, nameTenant2:doc.data().nameTenant2, checkIn: doc.data().input[20], date: doc.data().date, sign: doc.data().sign, email:doc.data().email })
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


 



  return (
    <div className="wrapper-documentsPage">
      <div>
        <Sidebar />
        <iframe ref={iframeRef} src={urlToPrint} />
      </div>
      <div>
        <div className="top-nav">
          <h2> Documents </h2>
          <input type={'text'} placeholder="Find Customer" onChange={(e)=>setFinding(e.target.value)}></input>
          <button> <i className="bi bi-search searchIcon"></i> </button>
          <i class="bi bi-sliders editIcon" onClick={()=>setShowEdits(!showEdits)}></i>
        </div>
            {documents.map((application) => (
              <div className='documents-row' key={application}>
                <div id="left" onClick={()=>printOrder('/sheet1?id=' + application.id + "&&print=true")}>
                <p id="checkIn"> <b>Check-in: </b>  {application.checkIn}  </p>
                <p id="name"> {application.nameTenant1}  </p>
                <p id="id"> {application.id}  </p>
                <p id="title"> {application.title} </p>
                <p> {application.date}  </p>
                <i className="bi bi-chevron-right iconChevRight"></i>
                </div>
                <div id="right" style={{display: showEdits? "flex":"none"}}>
                  <i className="bi bi-pencil-square writeIcon" onClick={()=> window.location.href = "/document?id=" + application.id}></i>
                  {/* <i className="bi bi-trash3 deleteIcon"></i> */}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}

export default DocumentsPage;
