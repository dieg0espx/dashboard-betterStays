import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar';

function CustomersPage() {
    const [customers, setCustomers] = useState([])
    const [finding, setFinding] = useState('')

    useEffect(()=>{
        getCustomers()
    },[])

    function getCustomers(){
        fetch('http://localhost:3002/api/getAllCustomers')
        .then(response => response.json())
        .then(response => {
            const sortedCustomers = response.results
            .sort((a, b) => a.fullName?.localeCompare(b.fullName));
            setCustomers(sortedCustomers);
        })
    }
    function formatPhoneNumber(phoneNumber) {
        const cleaned = ('' + phoneNumber).replace(/\D/g, ''); // Remove non-numeric characters
        if (cleaned.length > 10) {
          return cleaned.replace(/^(\d{1,4})(\d{3})(\d{3})(\d{4})$/, '+$1 ($2) $3-$4');
        }
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
          return '(' + match[1] + ') ' + match[2] + '-' + match[3];
        }
        return phoneNumber; 
    }
      
    

  return (
    <div className='wrapper-customersPage'>
        <div>
            <Sidebar />
        </div>
        <div>
            <div className='top-nav'>
                <h2> Customers </h2>
                <input type="text" placeholder='Find Customer' onChange={(e)=>setFinding(e.target.value)}></input>
                <button> <i className="bi bi-search searchIcon"></i> </button>
            </div>
            {customers.filter((customer) => customer.fullName && customer.email && customer.phone &&customer.fullName.includes(finding)).map((customer) => (
                <div className='customers-row' key={customer.id}>
                  <p id='name'>{customer.fullName}</p>
                  <p>{formatPhoneNumber(customer.phone)}</p>
                  <p>{customer.email}</p>
                </div>
            ))}
        </div>
    </div>
  )
}

export default CustomersPage