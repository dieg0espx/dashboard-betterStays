import React, { useState, useRef, useEffect } from 'react'
import SignatureCanvas from 'react-signature-canvas';
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { app } from '../Firebase.js';
import { doc, setDoc } from "firebase/firestore"; 

function Document() {
    const db = getFirestore(app);
    const [sign, setSign] = useState(null)
    const [mySign, setMySign] = useState()
    const [showPopup, setShowPopup] = useState(false)
    const [fullName, setFullName] = useState("")
    const [showSave, setShowSave] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false)


    function clearSign(){
        sign.clear();
    }
    function storeSign(){
        setShowPopup(false)
        const signatureData = sign.toDataURL();
        setMySign(signatureData)
    }
    function formatDate(date) {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
      }
    
    async function handleSave(){
        let data = { 
            name: fullName,
            title: "Document 1",
            date: formatDate(new Date()),
            sign : sign.getTrimmedCanvas().toDataURL('image/png').toString()
        }
        try {
            await addDoc(collection(db, "documents"), data);
            setShowConfirmation(true)
          } 
        catch (error) {
            alert("You are missing some fields.")
        }
    }

    useEffect(()=>{
        if (sign) {
            const isCanvasEmpty = sign.isEmpty();
            setShowSave(false)
            if (!isCanvasEmpty && fullName.length > 8) {
              setShowSave(true)
            }
        }
    })

  return (
    <div className='wrapper-document'>
        <div className='content'>
            <div className='header'>
                <img src='https://res.cloudinary.com/dxfi1vj6q/image/upload/v1682964660/Final_Logo_1_byrdtx.png' />
            </div>

            <p>1. <b>THE PARTIES.</b> THE PARTIES. This Short-Term Rental Agreement (“Agreement”) made on <input type='text'/>,20 <input type='number'/> betweeen the following: </p>

            <div className='sign'>
                <img src={mySign} />
                <p> {fullName} </p>
            </div>
        </div>
        <div className='floatingBtns'>
            <button id="sign" onClick={()=> setShowPopup(true)}> <i className="bi bi-pencil-square"></i>  Sign </button>
            <button id="save"  style={{display: showSave ? "block":"none"}} onClick={()=> handleSave()}> Save <i className="bi bi-chevron-right"></i> </button>
        </div>
        <div className='overlay'  style={{display: showPopup? "block":"none"}} onClick={()=>setShowPopup(false)}></div>
        <div className='sign-pad' style={{display: showPopup? "block":"none"}}>
            <div className='pad'>
            <SignatureCanvas 
                canvasProps={{width: 720, height: 300, className: 'sigCanvas'}} 
                ref={sign=>setSign(sign)}
            ></SignatureCanvas>
            </div>
            <input type='text' placeholder='Full Name' onChange={(e)=>setFullName(e.target.value)}></input>
            <div className='actions'>
                <button style={{display: fullName.length > 8? "block":"none"}} onClick={()=>storeSign(false)}id="save"> Save </button>
                <button id="cancel" onClick={()=>clearSign()}> Clear </button>
            </div>
        </div>
        <div className='confirmation' style={{display: showConfirmation? "flex":"none"}}>
            <div className='confirmation-content'>
                <i className="bi bi-check2-circle checkIcon"></i>
                <h2> Thanks !</h2>
                <p> Your document has been sent successfully </p>
            </div>
        </div>
    </div>
  )
}

export default Document