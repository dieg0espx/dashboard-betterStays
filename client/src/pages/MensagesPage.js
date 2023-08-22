import React, { useState, useEffect, useRef } from 'react'
import Sidebar from '../components/Sidebar'
import { getFirestore, collection, query, getDocs, setDoc } from 'firebase/firestore';
import { app } from '../Firebase';
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import adminTail from '../components/adminTail.png'
import customerTail from '../components/customerTail.png'

import useSound from 'use-sound'
import mySound from '../components/notification.mp3'

function MensagesPage() {
    const db = getFirestore(app);
    const messagesContainerRef = useRef(null);


    const [messages, setMessages] = useState([])
    const [contacts, setContacts] = useState([])

    const [strNewMesasge, setStrNewMesasge] = useState('')
    const [conversation,setConversation] = useState('jabaraja@hotmail.com - Jorge Espinosa')


    const [receivedMessages, setReceivedMessages] = useState(0);
    const [firstCount, setFirstCount] = useState(true)

    const [isMobile, setIsMobile] = useState(false)
    const [showChat, setShowChat] = useState(false)


    useEffect(() => {
        getContacts();
        if (window.innerWidth  <= 500){
          setIsMobile(true)
        }
      }, []);
    
      async function getContacts(){
        try {
          const q = query(collection(db, "Messages"));
          let contactsArray = []
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            contactsArray.push(doc.id)
        });
        setContacts(contactsArray);
          } catch (error) {
            console.error('Error fetching documents:', error);
          }         
      }

      const [playSound] = useSound(mySound)


        useEffect(()=>{
            console.log("Open Conversation: " + conversation);
            const messagesRef = doc(db, "Messages", conversation);
            onSnapshot(messagesRef, (doc) => {
                const data = doc.data();
                if (data) {
                    const keys = Object.keys(data);
                    keys.sort();
                    const sortedData = {};
                    keys.forEach((key) => {
                      sortedData[key] = data[key];
                    });
                    setMessages(sortedData)
                }
            });
            
        },[conversation])

        useEffect(() => {
          let received = 0
          for( let i = 0; i < Object.keys(messages).length; i ++ ){
            if(Object.keys(messages)[i].includes('customer')){
              received ++
            }
          }
          compareCount(received)
        }, [messages]);

        function compareCount(num){
          console.log(firstCount);
          if(num > receivedMessages){
            if(firstCount == false){
              playSound()
            }
          } 
          setFirstCount(false)
          setReceivedMessages(num)
        }





        async function sendMessage() {
            const newMessageRef = doc(db, "Messages", conversation);
            const updateData = {};
            updateData[generateKey()] = strNewMesasge;
            await updateDoc(newMessageRef, updateData);
            setStrNewMesasge('')
        }

        function generateKey(){
            const currentDate = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
            const dateTimeString = currentDate.toLocaleString('en-US', options);
            return (dateTimeString + ' admin');
        }

        function getTime(str){
            const timeRegex = /\d{1,2}:\d{2}:\d{2}\s[APap][Mm]/;
            const extractedTime = str.match(timeRegex)[0];
            const timeParts = extractedTime.split(":");
            const hour = parseInt(timeParts[0]);
            const minute = parseInt(timeParts[1]);
            const period = timeParts[2].split(" ")[1];
            const formattedTime = `${hour}:${minute.toString().padStart(2, '0')} ${period}`;
            return(formattedTime);
        }

        function openConversation(email, name){
            let str = email + '-' + name;
            setConversation(str)
            setFirstCount(true)
            setShowChat(true)
        }

        const handleKeyDown = (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              sendMessage()
            }
        };
    


  useEffect(() => {
    // Scroll to the bottom of the messages container
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div>
      <div className='wrapper-messagesPage' style={{display: isMobile? "none":"block"}} >
          <div>
              <Sidebar />
          </div>
          <div>
            {/* <div className='top-nav'>
                  <h2> Messages </h2>
            </div> */}
            <div className='chats'>
              <div className='contacts'>
                  <p id="title"> Chats </p>
                {contacts.map((contact, i) => 
                  <div className={contact.split('-')[0].includes(conversation.split('-')[0]) ? "selected-row":"row"} key={i} onClick={()=> openConversation(contact.split('-')[0], contact.split('-')[1])}>
                      <div>
                          <i className="bi bi-person-circle iconPerson"></i>
                      </div>
                      <div>
                          <p id="name"> {contact.split('-')[1]} </p>
                          {/* <p id="email"> {contact.split('-')[0]} </p> */}
                      </div>
                  </div>
                )}
              </div>
              <div className='messages'>
                  <div className='top-bar'>
                      <p> <i className="bi bi-person-circle"></i> {conversation.split('-')[1]} </p>
                      <p>{conversation.split('-')[0]} </p>
                  </div>
                  <div className='bubles' ref={messagesContainerRef}>
                      {Object.keys(messages).map((key) => (
                            <div key={key}>
                              <div className={key.includes('admin') ? 'buble admin-buble' : 'buble customer-buble'}>
                                <p> {messages[key]} </p>
                              </div>
                              <img className="adminTail" style={{display:key.includes('admin') ? "block":"none" }} src={adminTail} />
                              <img className="customerTail" style={{display:key.includes('customer') ? "block":"none" }} src={customerTail} />

                              <p className={key.includes('admin') ? 'message-hour admin-hour' : 'message-hour customer-hour'} >
                                {getTime(key)}
                              </p>
                            </div>
                          )
                          )
                      }
                  </div>
                  <div className='wrapper-newMessages'>
                      <textarea className='new-message' value={strNewMesasge}  rows={4} onKeyDown={handleKeyDown} onChange={(e)=>setStrNewMesasge(e.target.value)} placeholder='Type your message'/>
                      <i className="bi bi-arrow-up-circle-fill arrowIcon" onClick={()=>sendMessage()}></i>
                  </div>
              </div>
            </div>
                    
          </div>
      </div>
      <div className='wrapper-messagesPage' style={{display: isMobile? "block":"none"}} >
          <div>
              <Sidebar />
          </div>
          <div>
              <div className='contacts-window' style={{display: showChat? "none":"block"}}>
                  <div className='contacts'>
                      <p id="title"> Chats </p>
                    {contacts.map((contact, i) => 
                      <div className={contact.split('-')[0].includes(conversation.split('-')[0]) ? "selected-row":"row"} key={i} onClick={()=> openConversation(contact.split('-')[0], contact.split('-')[1])}>
                          <div>
                              <i className="bi bi-person-circle iconPerson"></i>
                          </div>
                          <div>
                              <p id="name"> {contact.split('-')[1]} </p>
                              {/* <p id="email"> {contact.split('-')[0]} </p> */}
                          </div>
                      </div>
                    )}
                  </div>
              </div>
              <div className='messages-window' style={{display: showChat? "block":"none"}}>
                  <div className='messages'>
                      <div className='top-bar'>
                          <p>  <i style={{display: isMobile? "inline":"none"}} className="bi bi-chevron-left" onClick={()=>setShowChat(false)}></i> <i className="bi bi-person-circle"></i> {conversation.split('-')[1]} </p>
                          <p style={{display: isMobile? "none":"block"}}>{conversation.split('-')[0]} </p>
                      </div>
                      <div className='bubles' ref={messagesContainerRef}>
                          {Object.keys(messages).map((key) => (
                                <div key={key}>
                                  <div className={key.includes('admin') ? 'buble admin-buble' : 'buble customer-buble'}>
                                    <p> {messages[key]} </p>
                                  </div>
                                  <img className="adminTail" style={{display:key.includes('admin') ? "block":"none" }} src={adminTail} />
                                  <img className="customerTail" style={{display:key.includes('customer') ? "block":"none" }} src={customerTail} />
                          
                                  <p className={key.includes('admin') ? 'message-hour admin-hour' : 'message-hour customer-hour'} >
                                    {getTime(key)}
                                  </p>
                                </div>
                              )
                              )
                          }
                      </div>
                      <div className='wrapper-newMessages'>
                          <textarea className='new-message' value={strNewMesasge}  rows={4} onKeyDown={handleKeyDown} onChange={(e)=>setStrNewMesasge(e.target.value)} placeholder='Type your message'/>
                          <i className="bi bi-arrow-up-circle-fill arrowIcon" onClick={()=>sendMessage()}></i>
                      </div>
                  </div>
              </div>    
          </div>
      </div>
    </div>

  )
}
export default MensagesPage
