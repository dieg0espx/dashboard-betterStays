import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { getFirestore, collection, query, getDocs, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { app } from '../Firebase';
import { doc, getDoc } from "firebase/firestore";
import { Calendar } from 'react-calendar';

function PropertiesPage() {
    const apiURL = process.env.REACT_APP_APIURL;
    const db = getFirestore(app);
    const [properties, setProperties] = useState([])
    const [propertyData, setPropertyData] = useState([])
    const [showPopup, setShowPopup] = useState(false)
    const [searchDate, setSearchDate] = useState();
    const [minNights, setMinNights] = useState(0)
    const [selectedProperty, setSelectedProperty] = useState([])
    const [selectedDates, setSelectedDates] = useState([])

    //FUNCTION TO FORMAT DATE YYYY-MM-DD
    const formatDate = (range) => {
        const year = range.getFullYear();
        const month = String(range.getMonth() + 1).padStart(2, '0');
        const day = String(range.getDate()).padStart(2, '0');
        return `${month}/${day}/${year}`;
    };

    useEffect(()=>{
        getProperties()
        getPropertiesData()
    },[])

    function getProperties() {
        fetch(apiURL + '/api/getProperties')
        .then(response => response.json())
        .then(response => setProperties(response.results))
    }
    async function getPropertiesData() {
        try {
          const q = query(collection(db, "Properties"));
          let data = [];
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            data.push({ 
                id: doc.id, 
                min: doc.data().min, 
                max: doc.data().max, 
                rules:doc.data().rules 
            });
          });
        //   console.log(data);
          setPropertyData(data);
        } catch (error) {
          console.error('Error fetching documents:', error);
        }
    }

    function getMin(property){
        for(let i = 0; i < propertyData.length; i ++){
            if(propertyData[i].id == property){
                return propertyData[i].min
            } 
         }
    }
    function getMax(property){
        for(let i = 0; i < propertyData.length; i ++){
            if(propertyData[i].id == property){
                return propertyData[i].max
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

    function openPopup(id, nickname){
        setMinNights(0)
        setSelectedProperty({nickname: nickname, id:id})
        setShowPopup(!showPopup)
    }

    async function addNewRules(){
        const rulesRef = doc(db, "Properties", selectedProperty.nickname);
        for(let i = 0; i < selectedDates.length; i ++){
            await updateDoc(rulesRef, {
                rules: arrayUnion(selectedDates[i] + ' - ' + minNights)
            });
        }
        alert("New rules added successfully !");
        setShowPopup(false)
        getPropertiesData()
    }

    const onDateSelected = async (range) => {
        let currentDate = new Date(range[0]);
        let endDate = new Date(range[1]);
        let dateArray = [];

        while (currentDate <= endDate) {
          dateArray.push(formatDate(new Date(currentDate)));
          currentDate.setDate(currentDate.getDate() + 1);
        }
        console.log(dateArray);
        setSelectedDates(dateArray)
    }
    function getRules(property) {
        let rulesMap = [];  
        for (let i = 0; i < propertyData.length; i++) {
          if (property === propertyData[i].id) {
            const rules = propertyData[i].rules;
            if(rules){
                for (let i = 0; i < rules.length; i++) {
                    const ruleDate = new Date(rules[i].split('-')[0]);
                    const currentDate = new Date();
                    currentDate.setDate(currentDate.getDate() - 1);
                    if (ruleDate >= currentDate) {
                      rulesMap.push(
                        <div className='rule' key={i}>
                          <p>{ruleDate.toLocaleDateString()}</p>
                          <p>{rules[i].split('-')[1]} nights</p>
                        </div>
                      );
                    }
                  }
                return rulesMap;
            }
        }}
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
                    <div className='properties-row' key={property._id}>
                        <div className='details'>
                            <i className="bi bi-calendar-plus iconCalendarPlus" onClick={()=>openPopup(property._id, property.nickname)}></i>
                            <p id="name">{property.nickname}</p>
                            <p> {property.title}</p>
                            <div className='minMaxNights'>
                                <p className='labelMinMax'> Min: </p>
                                <input type='tel' placeholder={getMin(property.nickname)} onChange={(e)=>updateMinMax('min', property.nickname, e.target.value)}/>
                                <p className='labelMinMax'> Max: </p>
                                <input type='tel' placeholder={getMax(property.nickname)} onChange={(e)=>updateMinMax('max', property.nickname, e.target.value)}/>
                            </div>
                        </div>
                        <div className='rules'>
                             {getRules(property.nickname)}
                        </div>
                    </div>
                );
            })}
            </div>

            <div className='overlay' style={{display: showPopup? "block":"none"}} onClick={()=>setShowPopup(false)}></div>
            <div className='newRule-popup' style={{display: showPopup? "grid":"none"}}>
                <h2> New Rule - {selectedProperty.nickname}</h2> 
                <div className='content'>
                    <div>
                        <Calendar
                            onActiveStartDateChange={(e) => setSearchDate(e.activeStartDate)}
                            className="calendar"
                            view="month"
                            minDate={new Date()}
                            selectRange={true}
                            onChange={onDateSelected}
                        ></Calendar>
                    </div>
                    <div>
                        <h3> {minNights} </h3>
                        <p> nights</p>
                        <div className='buttons'>
                            <i class="bi bi-dash-circle-fill iconIncreaseDecrease" onClick={()=>setMinNights(minNights - 1)}></i>
                            <i class="bi bi-plus-circle-fill iconIncreaseDecrease" onClick={()=>setMinNights(minNights + 1)}></i>
                        </div>
                        <button id="btnSave" onClick={()=>addNewRules()}> Save </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default PropertiesPage
