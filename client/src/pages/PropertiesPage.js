import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { getFirestore, collection, query, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { app } from '../Firebase';
import { doc, getDoc } from "firebase/firestore";

function PropertiesPage() {
    const db = getFirestore(app);
    const [properties, setProperties] = useState([])
    const [minMax, setMinMax] = useState([])

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
                        <p id="name">{property.nickname}</p>
                        <p> {property.title}</p>
                        <div className='minMaxNights'>
                            <p className='labelMinMax'> Min: </p>
                            <input type='tel' placeholder={getMin(property.nickname)} onChange={(e)=>updateMinMax('min', property.nickname, e.target.value)}/>
                            <p className='labelMinMax'> Max: </p>
                            <input type='tel' placeholder={getMax(property.nickname)} onChange={(e)=>updateMinMax('max', property.nickname, e.target.value)}/>
                        </div>
                    </div>
                );
            })}
            </div>
        </div>
    </div>
  )
}

export default PropertiesPage
