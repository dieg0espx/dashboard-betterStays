import React, { useState, useRef, useEffect, useLocation, PureComponent } from 'react';
import Sidebar from '../components/Sidebar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, LineChart, Area, AreaChart, RadialBarChart, RadialBar, PieChart, Pie, Cell } from 'recharts';


function Overview() {
    const apiURL = process.env.REACT_APP_APIURL;

    const [data, setData] = useState([])
    const [totReservations, setTotReservations] = useState(0)
    const [reservationsPerProperty, setReservationPerProperty] = useState([])
    const [reservationsPerMonth, setReservationsPerMonth] = useState([])
    const [averageNightsPerProperty, setAverageNightsPerProperty] = useState([])
    const [monthlyIncome,setMonthlyIncome] = useState([])
    const [monthlyIncomePerProperty,setMonthlyIncomePerProperty] = useState([])
    const [platforms, setPlatforms] = useState([])
    const [currentMonth, setCurrentMonth] = useState([])
    const [graphSizes, setGraphSizes] = useState([])
    // const [selectedProperty, setSelectedProperty] = useState('')

    let graphs = [false, false, false, false, false, false]


    let properties = [
        {name: "The Pool House",     id:"638a965985cf74003f7b34e6"},
        {name: "Marigold",          id:"627c1ef89d63b2003223d578"},
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
        if(data.length > 0 ){
            getTotReservations()
            getReservationsPerProperty()
            getReservationsPerMonth()
            getAverageNightsPerProperty()
            getMonthlyIncome()
            getPlatforms()
            getMonthlyIncomePerProperty('')
        }
    },[data])

    useEffect(()=>{
        getCurrentMonth()
    },[reservationsPerMonth])

    async function getCalendar() {
        let startDate = '2023-01-01'
        let endDate = '2023-12-30'
        const apiUrl = `${apiURL}/api/multipleCalendar?start=${encodeURIComponent(startDate)}&end=${encodeURIComponent(endDate)}`;
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
          return { propertyName: property.name, Reservations: countReservations};
        });
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
            reservations.push({month: monthNames[i-1], Reservations: reservationsCount})
        }
        setReservationsPerMonth(reservations)
    }   
    async function getAverageNightsPerProperty(){
        let reservations = [];
        for (let i = 0; i < properties.length; i++) {
          let nightsCount = [];
          for (let j = 0; j < data.length; j++) {
            if (data[j].status === "booked" && data[j].listingId === properties[i].id) {
              if (data[j].reservation && data[j].reservation.nightsCount) {
                nightsCount.push(data[j].reservation.nightsCount);
              }
            }
          }
          let sum = 0;
          for(let k = 0; k < nightsCount.length; k ++){
            sum = sum + nightsCount[k]
          }
          reservations.push({property: properties[i].name, average: (sum/nightsCount.length).toFixed(1)})
        }
        setAverageNightsPerProperty(reservations)
    }
    async function getMonthlyIncome() {
        let incomes = [];
        for (let i = 1; i <= 12; i++) {
            let amount = 0;
            for (let j = 0; j < data.length; j++) {
                if (data[j].status == "booked") {
                    let currentMonth = data[j].date.split('-')[1];
                    if (currentMonth == i) {
                        amount += parseFloat(data[j].reservation.money.totalPaid);
                    }
                }
            }
            amount = parseFloat(amount.toFixed(2));
            incomes.push({ month: monthNames[i - 1], USD: amount });
        }
        setMonthlyIncome(incomes);
    }
    async function getPlatforms(){
        let platforms = []
        for(let i = 0; i < data.length; i ++){
            if(data[i].status == 'booked'){
                platforms.push(data[i].reservation.integration.platform)
            }
        }
        function countOccurrences(arr) {
            let platfoms = []
            const countMap = {}
            arr.forEach(function (element) {
              if (countMap[element]) {
                countMap[element]++;
              } else {
                countMap[element] = 1;
              }
            });
            for (const element in countMap) {
              platfoms.push({name: element.toLocaleUpperCase(), Reservations:countMap[element] })
            }
            return platfoms
        }
        setPlatforms(countOccurrences(platforms))
    }
    async function getCurrentMonth(){
        const currentDate = new Date();
        const currentMonth = monthNames[currentDate.getMonth()];
        const currentMonthNumber = currentDate.getMonth();

        let amount = 0
        let reservations = 0;
        for(let i = 0; i < reservationsPerMonth.length; i ++){
            if(reservationsPerMonth[i].month == currentMonth){
                reservations = reservationsPerMonth[i].Reservations
            }
        }

        for(let i = 0;i < monthlyIncome.length; i ++){
            if(monthlyIncome[i].month == currentMonth){
                amount = monthlyIncome[i].USD
            }
        }

        let currentReservations = {
            reservations: reservations,
            income: amount.toLocaleString()
          };
        setCurrentMonth(currentReservations)
    }

    async function getMonthlyIncomePerProperty(propertyName) {
        let listingId ='';
        for(let a = 0; a < properties.length; a ++){
            if(properties[a].name ==  propertyName){
                listingId = properties[a].id
                break
            }
        }

        let incomes = [];
        for (let i = 1; i <= 12; i++) {
            let amount = 0;
            for (let j = 0; j < data.length; j++) {
                if (data[j].status == "booked" && data[j].listingId.includes(listingId)) {
                    let currentMonth = data[j].date.split('-')[1];
                    if (currentMonth == i) {
                        amount += parseFloat(data[j].reservation.money.totalPaid);
                    }
                }
            }
            amount = parseFloat(amount.toFixed(2));
            incomes.push({ month: monthNames[i - 1], USD: amount });
        }
        console.log("Montly Income per Property: " +  propertyName);
        console.log(incomes);
        setMonthlyIncomePerProperty(incomes);
    }

    function resizeGraph(graph) {
        setGraphSizes(prevGraphSizes => {
          const newGraphSizes = [...prevGraphSizes];
          newGraphSizes[graph] = !newGraphSizes[graph];
          return newGraphSizes;
        });
    }
    



  return (
    <div className="wrapper-overview">
      <div>
        <Sidebar />
      </div>
      <div className='content'>
        <div className={graphSizes[0] ? 'extended-graph':'graph'}>
            <i className="bi bi-aspect-ratio resizeIcon" onClick={()=>resizeGraph(0)}></i>
            <ResponsiveContainer width="95%" height="85%">
                <BarChart data={reservationsPerProperty} barSize={35}  margin={{left: -10}}>
                  <XAxis dataKey="propertyName" scale="band" padding={{ left: 3, right: 3}} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="Reservations" fill="#0089BF" background={{ fill: 'white' }} />
                </BarChart>
            </ResponsiveContainer>
            <p> Property Reservations </p>
        </div>
        <div className={graphSizes[1] ? 'extended-graph':'graph'}>
            <i className="bi bi-aspect-ratio resizeIcon" onClick={()=>resizeGraph(1)}></i>
            <ResponsiveContainer width="100%" height="85%">
                <AreaChart width={500} height={400} data={reservationsPerMonth} margin={{left: -10}}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="Reservations" stroke="#0089BF" fill="#0089BF" />
                </AreaChart>
            </ResponsiveContainer>
            <p> Monthly Reservations</p>
            {/* <select onChange={(e)=>getMonthlyIncomePerProperty(e.target.value)} className='selectProperty'>
                <option> All Properties </option>
                {properties.map((property) => (
                    <option key={property.id}>{property.name}</option>
                ))}
            </select> */}
        </div>
        <div className={graphSizes[2] ? 'extended-graph':'graph'}>
            <i className="bi bi-aspect-ratio resizeIcon" onClick={()=>resizeGraph(2)}></i>
            <ResponsiveContainer width="95%" height="85%">
                <BarChart data={averageNightsPerProperty} barSize={35}  margin={{left: -10}}>
                  <XAxis dataKey="property" scale="band" padding={{ left: 3, right: 3}} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="average" fill="#0089BF" background={{ fill: 'white' }} />
                </BarChart>
            </ResponsiveContainer>
            <p> Average Nights </p>
        </div>
        <div className={graphSizes[3] ? 'extended-graph':'graph'}>
            <i className="bi bi-aspect-ratio resizeIcon" onClick={()=>resizeGraph(3)}></i>
            <ResponsiveContainer width="100%" height="83 %">
                <LineChart data={monthlyIncome} margin={{ left: 20 }}>
                    <XAxis dataKey="month" tickFormatter={(value) => `$${value.toLocaleString()}`} />
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Line type="monotone" dataKey="USD" stroke="#0089BF" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
            <p>Monthly Income</p>
            <select onChange={(e)=>getMonthlyIncomePerProperty(e.target.value)} className='selectProperty'>
                <option> All Properties </option>
                {properties.map((property) => (
                    <option key={property.id}>{property.name}</option>
                ))}
            </select>
        </div>
        <div className={graphSizes[4] ? 'extended-graph':'graph'}>
            <i className="bi bi-aspect-ratio resizeIcon" onClick={()=>resizeGraph(4)}></i>
            <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                <Pie
                    dataKey="Reservations"
                    isAnimationActive={false}
                    data={platforms}
                    cx="50%"
                    cy="50%"
                    // outerRadius={100}
                    fill="#0089BF"
                    label
                    margin={{left: 50}}
                />
                <Tooltip />
                </PieChart>
            </ResponsiveContainer>
            <p> Platform Used </p>
        </div>
        <div className={graphSizes[5] ? 'extended-graph':'graph'}>
            <i className="bi bi-aspect-ratio resizeIcon" onClick={()=>resizeGraph(5)}></i>
            <div className='detail'>
                <h1>{currentMonth.reservations}</h1> 
                <h2> Nights Booked </h2>
            </div>
            <div className='detail'>
                <h3>${currentMonth.income}</h3>
                <h2> USD </h2>
            </div>
            <p> Current Month </p>
        </div>
      </div>
    </div>
  );
}

export default Overview;