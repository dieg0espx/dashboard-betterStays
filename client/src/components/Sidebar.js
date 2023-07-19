import React, { useState } from 'react'

function Sidebar() {
    const [page, setPage] = useState(0)

  return (
    <div className='wrapper-sidebar'>
        <img src='https://res.cloudinary.com/dxfi1vj6q/image/upload/v1683933526/Final_Logo_1_byrdtx_m9colt.png'/>
        <div className='menu'>
            <button style={{color: page == 0 ? "#0089BF":"white"}} onClick={()=>setPage(0)}> <i className="bi bi-calendar2-week"></i> Calendar </button>
            <button style={{color: page == 1 ? "#0089BF":"white"}} onClick={()=>setPage(1)}> <i className="bi bi-houses"></i> Properties </button>
            <button style={{color: page == 2 ? "#0089BF":"white"}} onClick={()=>setPage(2)}> <i className="bi bi-people"></i> Customers </button>
            <button style={{color: page == 3 ? "#0089BF":"white"}} onClick={()=>setPage(3)}> <i className="bi bi-chat-left-dots"></i> Messages </button>
            <button style={{color: page == 4 ? "#0089BF":"white"}} onClick={()=>setPage(4)}> <i className="bi bi-newspaper"></i> Newsletter </button>
            <button style={{color: page == 5 ? "#0089BF":"white"}} onClick={()=>setPage(5)}> <i className="bi bi-person-gear"></i> Support </button>
            <button style={{color: page == 6 ? "#0089BF":"white"}} onClick={()=>setPage(6)}> <i className="bi bi-sliders"></i> Others </button>
        </div>
    </div>
  )
}

export default Sidebar
