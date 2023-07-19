import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'

function CalendarPage() {
    const [calendar, setCalendar] = useState([])

    async function getCalendar(){
      fetch('http://localhost:3002/api/multipleCalendar')
      .then(response => response.json())
      .then(response => {
        const sortedDays = response.data.days.sort((a, b) => new Date(a.date) - new Date(b.date));
        setCalendar(sortedDays);
        console.log(response.data.days[0]);
      })
    }

    useEffect(()=>{
      getCalendar()
    },[])
       
    let propertiesID = [
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

    function getNameById(id) {
      const property = propertiesID.find((prop) => prop.id === id);
      return property ? property.name : "Property not found";
    }
    
    let calendarMap = [];
    if(!calendar){
      return ;
    } else {   // Group elements by date using reduce
      const groupedCalendar = calendar.reduce((acc, value) => {
        const date = value.date;
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(value);
        return acc;
      }, {});
    
      for (const [date, events] of Object.entries(groupedCalendar)) {
        const dateObj = new Date(date);
        dateObj.setDate(dateObj.getDate() + 1); // Increase the day by one
        const day = dateObj.getDate();
        const month = dateObj.toLocaleString('default', { month: 'long' });
        const dateStr = `${day} ${month}`;
        calendarMap.push(
          <div className="row" key={date}>
            <div className='date'>
              <p className='day'> {day}</p>
              <p className='month'> {month} </p>
            </div>
            <div>
              {events.map((event) => (
                <div key={event.id} style={{ display: event.status === "booked" ? "block" : "none" }}>
                  <p>
                    {propertiesID.find((prop) => prop.id === event.listingId).name} - ${event.price}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      }
    }


  return (
    <div className='wrapper-calendarPage'>
        <div>
            <Sidebar />
        </div>
        <div>
            {calendarMap}
        </div>
    </div>
  )
}

export default CalendarPage
