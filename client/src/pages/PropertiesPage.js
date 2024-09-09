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
    const [landlordPopup, setLandlordPopup] = useState(false)
    const [landlords, setLandlords] = useState([])
    const [currentNickname, setCurrentNickName] = useState('')
    


    // State to store landlord data
    const [landlordData, setLandlordData] = useState({
        address: '',
        email: '',
        fullName: '',
        mailingAddress: '',
        phone: ''
    });

    //FUNCTION TO FORMAT DATE YYYY-MM-DD
    const formatDate = (range) => {
        const year = range.getFullYear();
        const month = String(range.getMonth() + 1).padStart(2, '0');
        const day = String(range.getDate()).padStart(2, '0');
        return `${month}/${day}/${year}`;
    };

    
    useEffect(()=>{
        getLandlords()
        getProperties()
        getPropertiesData()
    },[])

    useEffect(()=>{
        if(properties.length > 0 && propertyData.length > 0){
            defaultRules()
        }
    },[properties, propertyData])


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


    const getLandlords = async () => {
        const querySnapshot = await getDocs(collection(db, "Landlords"));
        const landlordsData = [];
        querySnapshot.forEach((doc) => {
            landlordsData.push({ id: doc.id, ...doc.data() });
        });
        setLandlords(landlordsData);
    };
    

    const handleLandlordInputChange = (e) => {
        const { name, value } = e.target;
        setLandlordData({
            ...landlordData,
            [name]: value
        });
    }


    const closePopups = () =>{
        setLandlordPopup(false)
        setShowPopup(false)
        setLandlordData({
            address: '',
            email: '',
            fullName: '',
            mailingAddress: '',
            phone: ''
        })
    }

    const onPropertySettings = (nickname) => {
        setCurrentNickName(nickname)
        setLandlordPopup(true);
        const currentLandlord = landlords.find(landlord => landlord.id === nickname);
        console.log(currentLandlord);
        if (currentLandlord) {
            setLandlordData({
                address: currentLandlord.address || '',
                email: currentLandlord.email || '',
                fullName: currentLandlord.fullName || '',
                mailingAddress: currentLandlord.mailingAddress || '',
                phone: currentLandlord.phone || ''
            });
        }
    };

    const saveLandlord = async() => {
        await setDoc(doc(db, "Landlords", currentNickname), landlordData);
        alert("LandLord saved for : " + currentNickname)
        closePopups()
        await getLandlords()
    }


    const defaultRules = async () => {
        let count = 0;
        try {
            for (let property of properties) {
                // Check if the property.nickname exists in propertyData
                const propertyExists = propertyData.some(data => data.id === property.nickname);
    
                // If it doesn't exist, create a new document in Firestore
                if (!propertyExists) {
                    console.log(property.nickname);
                    
                    await setDoc(doc(db, "Properties", property.nickname), {
                        min: 1,
                        max: 60
                    });
                    count ++
                    console.log(`Default rules set for ${property.nickname}`);
                }
            }
           if(count > 0) {
            alert("Default rules have been set for properties that were missing.");
           }
        } catch (error) {
            console.error("Error setting default rules: ", error);
        }
    };
    




    

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
                            <i className="bi bi-sliders" onClick={()=>onPropertySettings(property.nickname)}></i>
                        </div>
                        <div className='rules'>
                             {getRules(property.nickname)}
                        </div>
                    </div>
                );
            })}
            </div>

            <div className='overlay' style={{display: showPopup || landlordPopup? "block":"none"}} onClick={()=>closePopups()}></div>
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

            <div className='landlord-popup' style={{ display: landlordPopup ? 'flex' : 'none' }}>
                <h2>Landlord Setup</h2>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    saveLandlord();
                }}>

                    <input 
                        type='text' 
                        placeholder='Property Address' 
                        name='address' 
                        value={landlordData.address} 
                        onChange={handleLandlordInputChange} 
                    />
                    <input 
                        type='text' 
                        placeholder='Email Address' 
                        name='email' 
                        value={landlordData.email} 
                        onChange={handleLandlordInputChange} 
                    />
                    <input 
                        type='text' 
                        placeholder='Full Name' 
                        name='fullName' 
                        value={landlordData.fullName} 
                        onChange={handleLandlordInputChange} 
                    />
                    <input 
                        type='text' 
                        placeholder='Mailing Address' 
                        name='mailingAddress' 
                        value={landlordData.mailingAddress} 
                        onChange={handleLandlordInputChange} 
                    />
                    <input 
                        type='text' 
                        placeholder='Phone' 
                        name='phone' 
                        value={landlordData.phone} 
                        onChange={handleLandlordInputChange} 
                    />
                    <button type='submit'>Save</button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default PropertiesPage
