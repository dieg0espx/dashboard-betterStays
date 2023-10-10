import React, { useState, useRef, useEffect, useLocation, PureComponent } from 'react';
import Sidebar from '../components/Sidebar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, LineChart, Area, AreaChart } from 'recharts';


function Overview() {

    const [data, setData] = useState([])
    const [totReservations, setTotReservations] = useState(0)
    const [reservationsPerProperty, setReservationPerProperty] = useState([])
    const [reservationsPerMonth, setReservationsPerMonth] = useState([])

    let properties = [
        {name: "The Pool House",     id:"638a965985cf74003f7b34e6"},
        {name: "Mariogold",          id:"627c1ef89d63b2003223d578"},
        {name: "Golfers Retreat",    id:"63670920fe8aa4007565c9d2"},
        {name: "The Lake House",     id:"63f03e1ce78efd003ec4d7de"},
        {name: "Sentinel",           id:"62a297f98d4ca500310bf165"},
        {name: "Oak Park Game Room", id:"643596e34613d0003620b962"},
        {name: "Landstrom",          id:"627c1f19b8ff0000368578ce"},
        {name: "Tuneberg",           id:"627c1f09c01e3a00346b803b"},
        {name: "Mario's Pad",        id:"6435af6b4613d0003623178c"},
    ]
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

    useEffect(()=>{
        getCalendar()
    },[])

    useEffect(()=>{
        console.log(data);
        if(data.length > 0 ){
            getTotReservations()
            getReservationsPerProperty()
            getReservationsPerMonth()
        }
    },[data])


    async function getCalendar() {
        let startDate = '2023-01-01'
        let endDate = '2023-12-30'
        const apiUrl = `https://apis-betterstay.vercel.app/api/multipleCalendar?start=${encodeURIComponent(startDate)}&end=${encodeURIComponent(endDate)}`;
        fetch(apiUrl)
          .then(response => response.json())
          .then(response => setData(response.data.days));
    }
    async function getTotReservations() {
        const totReservations = data.filter((item) => item.status === 'booked').length;
        setTotReservations(totReservations);
    }  
    async function getReservationsPerProperty() {
        const reservations = properties.map((property) => {
          const countReservations = data.filter(
            (item) => item.status === 'booked' && item.listingId === property.id
          ).length;
          return { propertyName: property.name, reservations: countReservations};
        });
        console.log(reservations);
        setReservationPerProperty(reservations);
    }
    async function getReservationsPerMonth(){
        let reservations = []
        for(let i = 1; i <= 12; i ++){
            let reservationsCount = 0;
            for(let j = 0; j < data.length; j++){
                if(data[j].status == "booked"){
                    let month = data[j].date.split('-')[1]
                    if(month == i){
                        reservationsCount ++
                    }
                }
            }
            reservations.push({month: monthNames[i-1], reservations: reservationsCount})
        }
        setReservationsPerMonth(reservations)
    }


   

      
  return (
    <div className="wrapper-overview">
      <div>
        <Sidebar />
      </div>
      <div id="right">
        
        <div className='graph'>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={reservationsPerProperty}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                  barSize={35}
                >
                  <XAxis dataKey="propertyName" scale="band" padding={{ left: 10, right: 10 }} />
                  <YAxis />
                  <Tooltip />
                  
                  <Bar dataKey="reservations" fill="#0089BF" background={{ fill: 'white' }} />
                </BarChart>
            </ResponsiveContainer>
        </div>
        <div className='graph'>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  width={500}
                  height={400}
                  data={reservationsPerMonth}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="reservations" stroke="#0089BF" fill="#0089BF" />
                </AreaChart>
            </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

export default Overview;