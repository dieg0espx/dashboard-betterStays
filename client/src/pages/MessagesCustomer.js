import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { getFirestore, collection, query, getDocs, setDoc } from 'firebase/firestore';
import { app } from '../Firebase';
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";

function MensagesCustomer() {
    const db = getFirestore(app);
    const [messages, setMessages] = useState([])
    const [keys, setKeys] = useState([])
    const [contacts, setContacts] = useState([])

    const [data, setData] = useState([])
    const [strNewMesasge, setStrNewMesasge] = useState('')

    useEffect(() => {
        getMessages();
      }, []);
    
      async function getMessages(){
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


        useEffect(()=>{
            onSnapshot(doc(db, "Messages", "espinsosa9mx@gmail.com - Diego Espinosa"), (doc) => {
                const data = doc.data();
            const sortedKeys = Object.keys(data).sort();
            const sortedData = sortedKeys.map((key) => data[key]);

            console.log("Sorted Data:", sortedData);
            console.log("Sorted Keys:", sortedKeys);

            setMessages(sortedData);
            setKeys(sortedKeys);
            }); 
        },[])

    

        async function sendMessage() {
            const newMessageRef = doc(db, "Messages", "espinsosa9mx@gmail.com - Diego Espinosa");
            const newKey = getNewKey();
            const updateData = {};
            updateData[newKey] = strNewMesasge;
            await updateDoc(newMessageRef, updateData);
            setStrNewMesasge('')
        }
        
        function getNewKey() {
            var dateObject = new Date();
            var year = dateObject.getFullYear();
            var month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
            var day = dateObject.getDate().toString().padStart(2, '0');
            var hours = dateObject.getHours().toString().padStart(2, '0');
            var minutes = dateObject.getMinutes().toString().padStart(2, '0');
            var seconds = dateObject.getSeconds().toString().padStart(2, '0');
            var outputString = `customer${month}${day}${year}${hours}${minutes}${seconds}`;
            return outputString;
        }
        
        function convertTimestamp(str){
            if(str.includes('admin')){
                const admin = str.slice(0, 5);
                const date = str.slice(5, 13);
                const time = str.slice(13);
    
    
                const formattedDate = `${date.slice(0, 2)}/${date.slice(2, 4)}/${date.slice(4)}`;
                const formattedTime = `${time.slice(0, 2)}:${time.slice(2, 4)}:${time.slice(4)}`;
    
                return `${admin}-${formattedDate}-${formattedTime}`;
            } else {
                const admin = str.slice(0, 8);
                const date = str.slice(8, 16);
                const time = str.slice(16);
                const formattedDate = `${date.slice(0, 2)}/${date.slice(2, 4)}/${date.slice(4)}`;
                const formattedTime = `${time.slice(0, 2)}:${time.slice(2, 4)}:${time.slice(4)}`;
                return `${admin}-${formattedDate}-${formattedTime}`;
            }
        };
        


  return (
    <div className='wrapper-messagesPage'>
        <div>
            {/* <Sidebar /> */}
        </div>
        <div>
          <div className='top-nav'>
                <h2> Messages </h2>
          </div>
          <div className='chats'>
            <div className='contacts'>
              {contacts.map((contact, i) => 
                <div className='row' key={i}>
                    <div>
                        <i className="bi bi-person-circle iconPerson"></i>
                    </div>
                    <div>
                        <p id="name"> {contact.split('-')[1]} </p>
                        <p id="email"> {contact.split('-')[0]} </p>
                    </div>
                </div>
              )}
            </div>
            <div className='messages'>
                <div className='bubles'>
                    {Object.keys(messages).map((key) => (
                          <div key={key}>
                            <div className={keys[key].includes('admin') ? 'buble admin-buble' : 'buble customer-buble'}>
                              <p> {messages[key]} </p>
                            </div>
                            <p className={keys[key].includes('admin') ? 'message-hour admin-hour' : 'message-hour customer-hour'} >
                              {convertTimestamp(keys[key]).split('-')[2]}
                            </p>
                          </div>
                        )
                        )
                    }
                </div>
                <div className='wrapper-newMessages'>
                    <textarea className='new-message' value={strNewMesasge} onChange={(e)=>setStrNewMesasge(e.target.value)}/>
                    <i className="bi bi-arrow-up-circle-fill arrowIcon" onClick={()=>sendMessage()}></i>
                </div>
            </div>
          </div>
        
        </div>
    </div>
  )
}
export default MensagesCustomer
