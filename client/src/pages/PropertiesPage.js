import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { getFirestore, collection, query, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { app } from '../Firebase';
import { doc, getDoc } from "firebase/firestore";
import { Calendar } from 'react-calendar';

function PropertiesPage() {
    const db = getFirestore(app);
    const [properties, setProperties] = useState([])
    const [minMax, setMinMax] = useState([])
    const [showPopup, setShowPopup] = useState(true)
    const [searchDate, setSearchDate] = useState();
    const [minNights, setMinNights] = useState(0)
    const [selectedProperty, setSelectedProperty] = useState([])

    useEffect(()=>{
        getProperties()
        getMinAndMax()
    },[])

    function getProperties() {
        fetch('https://apis-betterstay.vercel.app/api/getProperties')
        .then(response => response.json())
        .then(response => setProperties(response.results))
    }
    
    async function getMinAndMax() {
        try {
          const q = query(collection(db, "Properties"));
          let data = [];
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, min: doc.data().min, max: doc.data().max });
          });
        //  data.sort((a, b) => a.id - b.id);
            console.log(data);
          setMinMax(data);
        } catch (error) {
          console.error('Error fetching documents:', error);
        }
    }
    function getMin(property){
        for(let i = 0; i < minMax.length; i ++){
            if(minMax[i].id == property){
                return minMax[i].min
            } 
         }
    }
    function getMax(property){
        for(let i = 0; i < minMax.length; i ++){
            if(minMax[i].id == property){
                return minMax[i].max
            } 
        }
    }
    async function updateMinMax(action, property, value){
        let dataToPush = {}
        if(action == 'min'){
            dataToPush = {
                min: value
            }
        } else {
            dataToPush = {
                max: value
            }
        }

        try {
            await updateDoc(doc(db, "Properties", property), dataToPush);
          } 
          catch (error) {
            alert("You are missing some fields." + error)
          }
    }

    function addNewRule(id, nickname){
        setSelectedProperty({name: nickname, id:id})
        setShowPopup(!showPopup)
    }

    return (
    <div className='wrapper-propertiesPage'>
        <div>
            <Sidebar />
        </div>
        <div>
            <div className="top-nav">
              <h2> Properties  </h2>
            </div>
            <div className='content'>
            {properties.map((property) => {
                return (
                    <div className='properties-row' key={property._id} >
                        <p id="name">{property.nickname}</p>
                        <p> {property.title}</p>
                        <div className='minMaxNights'>
                            <p className='labelMinMax'> Min: </p>
                            <input type='tel' placeholder={getMin(property.nickname)} onChange={(e)=>updateMinMax('min', property.nickname, e.target.value)}/>
                            <p className='labelMinMax'> Max: </p>
                            <input type='tel' placeholder={getMax(property.nickname)} onChange={(e)=>updateMinMax('max', property.nickname, e.target.value)}/>
                        </div>
                        <i className="bi bi-calendar-plus iconCalendarPlus" onClick={()=>addNewRule(property._id, property.nickname)}></i>
                    </div>
                );
            })}
            </div>

            <div className='overlay' style={{display: showPopup? "block":"none"}} onClick={()=>setShowPopup(false)}></div>
            <div className='newRule-popup' style={{display: showPopup? "grid":"none"}}>
                <h2> {selectedProperty.name}</h2> 
                <div className='content'>
                    <div>
                        <Calendar
                            onActiveStartDateChange={(e) => setSearchDate(e.activeStartDate)}
                            className="calendar"
                            view="month"
                            minDate={new Date()}
                            selectRange={true}
                        ></Calendar>
                    </div>
                    <div>
                        <h3> {minNights} </h3>
                        <p> nights</p>
                        <div className='buttons'>
                            <i class="bi bi-dash-circle-fill iconIncreaseDecrease" onClick={()=>setMinNights(minNights - 1)}></i>
                            <i class="bi bi-plus-circle-fill iconIncreaseDecrease" onClick={()=>setMinNights(minNights + 1)}></i>
                        </div>
                        <button id="btnSave"> Save </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default PropertiesPage
