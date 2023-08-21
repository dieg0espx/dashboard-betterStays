import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

function CalendarPage() {
  const [calendar, setCalendar] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [showPopUp, setShowPopup] = useState(false)

  const [currentReservation, setCurrentReservation] = useState([]);


  useEffect(() => {
    getCalendar();
  }, []);

  let propertiesID = [
    {name: "The Pool House",     id:"638a965985cf74003f7b34e6" },
    {name: "Mariogold",          id:"627c1ef89d63b2003223d578" },
    {name: "Golfers Retreat",    id:"63670920fe8aa4007565c9d2" },
    {name: "The Lake House",     id:"63f03e1ce78efd003ec4d7de" },
    {name: "Sentinel",           id:"62a297f98d4ca500310bf165" },
    {name: "Oak Park Game Room", id:"643596e34613d0003620b962" },
    {name: "Landstrom",          id:"627c1f19b8ff0000368578ce" },
    {name: "Tuneberg",           id:"627c1f09c01e3a00346b803b" },
    {name: "Mario's Pad",        id:"6435af6b4613d0003623178c" },
  ]

  function getNameById(id) {
    const property = propertiesID.find((prop) => prop.id === id);
    return property ? property.name : "Property not found";
  }

  async function getCalendar(startDate, endDate) {
    const apiUrl = `https://apis-betterstay.vercel.app/api/multipleCalendar?start=${encodeURIComponent(startDate)}&end=${encodeURIComponent(endDate)}`;
    fetch(apiUrl)
      .then(response => response.json())
      .then(response => {
        if (response.data){
          setCalendar(response.data.days)
          console.log(response.data.days[3]);
        }
      });
  }

  useEffect(() => {
    if (calendar.length > 0) {
      const uniqueStartEndTimes = [];
      const updatedEvents = calendar.reduce((acc, item) => {
        if (item.status === "booked" && item.listingId.includes(selectedOption)) {
          const startEndTime = item.reservation.checkIn + " - " + item.reservation.checkOut;
          if (!uniqueStartEndTimes.includes(startEndTime)) {
            uniqueStartEndTimes.push(startEndTime);
            const event = {
              id: item.reservationId,
              title: item.reservation.guest.fullName,
              start: item.reservation.checkIn,
              end: item.reservation.checkOut,
              // guestsCount: item.reservation.gestsCount,
              // integration: item.reservation.integration.platform, 
              // hostPayout: item.reservation.money.hostPayout, 
              // totalPaid: item.reservation.money.totalPaid, 
              // balanceDue: item.reservation.money.balanceDue,
              // nightsCount: item.reservation.nightsCount, 
              // status: item.status, 
              // property : getNameById(item.listingId),
              backgroundColor: getRandomColor(),
            };
            acc.push(event);
          }
        }
        return acc;
      }, []);
      setEvents(updatedEvents);
    } else {
      console.log("Fetching Calendar ...");
    }
  }, [calendar]);

  function getRandomColor() {
  const getRandomComponent = () => Math.floor(Math.random() * 128 + 64).toString(16).padStart(2, '0');
  return `#${getRandomComponent()}${getRandomComponent()}${getRandomComponent()}`;
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${year}/${month}/${day}`;
  }

  function handleEventClick(eventClickInfo) {
    const { event } = eventClickInfo;
    let reservation =  {
      id: event.id, 
      title: event.title,
      start: event.start, 
      end: event.end, 
      guestsCount: event.guestsCount, 
      integration: event.integration, 
      hostPayout: event.hostPayout, 
      totalPaid: event.totalPaid, 
      balanceDue: event.balanceDue, 
      nightsCount: event.nightsCount, 
      status: event.status, 
      property: event.property
  }
  console.log(reservation);
    setCurrentReservation(reservation)
    setShowPopup(true)
  }

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    getCalendar(startDate, endDate);
  };

  const eventContent = (eventInfo) => {
    return (
      <div className="custom-event">
        <div className="event-title">{eventInfo.event.title}</div>
        <div className="event-time">
          {formatDate(eventInfo.event.start)} - {formatDate(eventInfo.event.end)}
        </div>
      </div>
    );
  };


  const handleDateChange = (arg) => {
    function formatDateToYYYYMMDD(dateString) {
      const dateObject = new Date(dateString);
      const year = dateObject.getFullYear();
      const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
      const day = String(dateObject.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    setStartDate(formatDateToYYYYMMDD(arg.start))
    setEndDate(formatDateToYYYYMMDD(arg.end))
    getCalendar(formatDateToYYYYMMDD(arg.start),formatDateToYYYYMMDD(arg.end));
  };

  

  return (
    <div className='wrapper-calendarPage'>
      <div>
        <Sidebar />
      </div>
      <div>
        <div className='calendar-topNav'>
          <select value={selectedOption} onChange={handleOptionChange}>
            <option value=""> All Properties </option>
            <option value={"638a965985cf74003f7b34e6"}> The Pool House     </option>
            <option value={"627c1ef89d63b2003223d578"}> Mariogold          </option>
            <option value={"63670920fe8aa4007565c9d2"}> Golfers Retreat    </option>
            <option value={"63f03e1ce78efd003ec4d7de"}> The Lake House     </option>
            <option value={"62a297f98d4ca500310bf165"}> Sentinel           </option>
            <option value={"643596e34613d0003620b962"}> Oak Park Game Room </option>
            <option value={"627c1f19b8ff0000368578ce"}> Landstrom          </option>
            <option value={"627c1f09c01e3a00346b803b"}> Tuneberg           </option>
            <option value={"6435af6b4613d0003623178c"}> Mario's Pad        </option>
          </select>
        </div>
        <FullCalendar
          className="frame-calendar"
          plugins={[dayGridPlugin]}
          initialView='dayGridMonth' // Set the initial view to show a month
          events={events}
          eventClick={handleEventClick}
          eventContent={eventContent}
          datesSet={handleDateChange}
        />
        <div className='overlay' style={{display: showPopUp ? "block":"none"}} onClick={()=>setShowPopup(false)}></div>
        <div className='reservationPopup' style={{display: showPopUp ? "block":"none"}}>
            <p> <b> Reservation Id: </b> {currentReservation.id} </p>
            <p> <b> Full Name: </b> {currentReservation.title} </p>
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;
