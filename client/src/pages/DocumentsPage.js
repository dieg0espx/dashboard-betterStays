import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { getFirestore, collection, query, getDocs } from 'firebase/firestore';
import { app } from '../Firebase';

function DocumentsPage() {
  const db = getFirestore(app);
  const [documents, setDocuments] = useState([]);
  const [finding, setFinding] = useState('')
  const [urlToPrint, setUrlToPrint] = useState('')

  useEffect(() => {
    getDocuments();
  }, []);

  async function getDocuments(){
    try {
      const q = query(collection(db, "documents"));
      let data = []
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        data.push({id: doc.id, title:doc.data().title, name:doc.data().name, date: doc.data().date, sign: doc.data().sign })
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
        </div>
            {documents.filter((application) => application.name.includes(finding)).map((application) => (
              <div className='documents-row' key={application} onClick={()=>printOrder('/sheet1?id=' + application.id)}>
                <p> {application.name}  </p>
                <p> {application.title} </p>
                <p> {application.date}  </p>
                <i className="bi bi-chevron-right iconChevRight"></i>
              </div>
            ))}
      </div>
    </div>
  );
}

export default DocumentsPage;
