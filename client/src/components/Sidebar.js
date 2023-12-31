import React, { useEffect, useState } from 'react'



function Sidebar() {
    const [page, setPage] = useState(9)
    const [showMobileMenu, setShowMobileMenu] = useState(false)

    useEffect(()=>{
      const currentUrl = window.location.href;

      if (currentUrl.includes('calendar')) {
        setPage(0);
      } else if (currentUrl.includes('customers')) {
        setPage(2);
      } else if (currentUrl.includes('documents')) {
        setPage(3);
      } else if (currentUrl.includes('messages')) {
        setPage(4);
      } else if (currentUrl.includes('newsletter')) {
        setPage(5);
      } else if (currentUrl.includes('support')) {
        setPage(6);
      } else if (currentUrl.includes('properties')) {
        setPage(7);
      } else if (currentUrl.includes('overview')) {
        setPage(9);
      }
    },[])
  
    function onPageSelect(page){
      switch (page) {
        case 0:
          setPage(0)
          window.location.href ='/calendar';
          break;
        case 2:
          setPage(2)
          window.location.href ='/customers';
          break;
        case 3:
          setPage(3)
          window.location.href ='/documents';
          break;
        case 4:
          setPage(4)
          window.location.href ='/messages';
          break;
        case 5:
          setPage(5)
          window.location.href ='/newsletter';
          break;
        case 6:
          setPage(6)
          window.location.href ='/support';
          break;
        case 7:
          setPage(7)
          window.location.href ='/properties';
          break;
        case 9:
            setPage(9)
            window.location.href ='/overview';
            break;
        default:
          break;
      }

    }

  return (
  <div>
    <div className='wrapper-sidebar'>
      <i className={showMobileMenu? "bi bi-chevron-up menuBtn":"bi bi-list menuBtn"} onClick={()=>setShowMobileMenu(!showMobileMenu)}></i>
      <img src='https://res.cloudinary.com/dxfi1vj6q/image/upload/v1683933526/Final_Logo_1_byrdtx_m9colt.png'/>
      <div className='menu'>
        <button style={{color: page == 9 ? "#0089BF":"white"}} onClick={()=>onPageSelect(9)}> <i className="bi bi-graph-up-arrow"></i> Overview </button>     
        <button style={{color: page == 0 ? "#0089BF":"white"}} onClick={()=>onPageSelect(0)}> <i className="bi bi-calendar2-week"></i> Calendar </button>
        <button style={{color: page == 2 ? "#0089BF":"white"}} onClick={()=>onPageSelect(2)}> <i className="bi bi-people"></i> Customers </button>
        <button style={{color: page == 3 ? "#0089BF":"white"}} onClick={()=>onPageSelect(3)}> <i className="bi bi-file-earmark-text"></i> Documents </button>
        <button style={{color: page == 4 ? "#0089BF":"white"}} onClick={()=>onPageSelect(4)}> <i className="bi bi-chat-left-dots"></i> Messages </button>
        <button style={{color: page == 6 ? "#0089BF":"white"}} onClick={()=>onPageSelect(6)}> <i className="bi bi-person-gear"></i> Support </button>
        <button style={{color: page == 7 ? "#0089BF":"white"}} onClick={()=>onPageSelect(7)}> <i className="bi bi-houses"></i> Properties </button>
        <button style={{color: page == 8 ? "#0089BF":"white"}} onClick={()=>window.location.href = "https://analytics.google.com/"}> <i className="bi bi-bar-chart-line"></i> Analytics </button>      
      </div>
    </div>
    <div className='mobile-menu' style={{display: showMobileMenu? "flex":"none"}}>
        <button style={{color: page == 9 ? "#0089BF":"white"}} onClick={()=>onPageSelect(9)}> <i className="bi bi-graph-up-arrow"></i> Overview </button>
        <button style={{color: page == 0 ? "#0089BF":"white"}} onClick={()=>onPageSelect(0)}> <i className="bi bi-calendar2-week"></i> Calendar </button>
        <button style={{color: page == 2 ? "#0089BF":"white"}} onClick={()=>onPageSelect(2)}> <i className="bi bi-people"></i> Customers </button>
        <button style={{color: page == 3 ? "#0089BF":"white"}} onClick={()=>onPageSelect(3)}> <i className="bi bi-file-earmark-text"></i> Documents </button>
        <button style={{color: page == 4 ? "#0089BF":"white"}} onClick={()=>onPageSelect(4)}> <i className="bi bi-chat-left-dots"></i> Messages </button>
        <button style={{color: page == 6 ? "#0089BF":"white"}} onClick={()=>onPageSelect(6)}> <i className="bi bi-person-gear"></i> Support </button>
        <button style={{color: page == 7 ? "#0089BF":"white"}} onClick={()=>onPageSelect(7)}> <i className="bi bi-houses"></i> Properties </button>
        <button style={{color: page == 8 ? "#0089BF":"white"}} onClick={()=>window.location.href = "https://analytics.google.com/"}> <i className="bi bi-bar-chart-line"></i> Analytics </button>           
      </div>
  </div>
   
  )
}

export default Sidebar
