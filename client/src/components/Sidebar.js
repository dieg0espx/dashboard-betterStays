import React, { useEffect, useState } from 'react'



function Sidebar() {
    const [page, setPage] = useState(0)

    useEffect(()=>{
      const currentUrl = window.location.href;

      if (currentUrl.includes('calendar')) {
        setPage(0);
      } else if (currentUrl.includes('properties')) {
        setPage(1);
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
      } else if (currentUrl.includes('others')) {
        setPage(7);
      }
    },[])
  
    function onPageSelect(page){
      switch (page) {
        case 0:
          setPage(0)
          window.location.href ='/calendar';
          break;
        case 1:
          setPage(1)
          window.location.href ='/properties';
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
          window.location.href ='/messaages';
          break;
        case 5:
          setPage(5)
          window.location.href ='/newsletter';
          break;
        case 6:
          setPage(6)
          window.location.href ='/support';
          break;
        default:
          break;
      }

    }

  return (
    <div className='wrapper-sidebar'>
        <img src='https://res.cloudinary.com/dxfi1vj6q/image/upload/v1683933526/Final_Logo_1_byrdtx_m9colt.png'/>
        <div className='menu'>
            <button style={{color: page == 0 ? "#0089BF":"white"}} onClick={()=>onPageSelect(0)}> <i className="bi bi-calendar2-week"></i> Calendar </button>
            <button style={{color: page == 1 ? "#0089BF":"white"}} onClick={()=>onPageSelect(1)}> <i className="bi bi-houses"></i> Properties </button>
            <button style={{color: page == 2 ? "#0089BF":"white"}} onClick={()=>onPageSelect(2)}> <i className="bi bi-people"></i> Customers </button>
            <button style={{color: page == 3 ? "#0089BF":"white"}} onClick={()=>onPageSelect(3)}> <i className="bi bi-archive"></i> Documents </button>
            <button style={{color: page == 4 ? "#0089BF":"white"}} onClick={()=>onPageSelect(4)}> <i className="bi bi-chat-left-dots"></i> Messages </button>
            <button style={{color: page == 5 ? "#0089BF":"white"}} onClick={()=>onPageSelect(5)}> <i className="bi bi-newspaper"></i> Newsletter </button>
            <button style={{color: page == 6 ? "#0089BF":"white"}} onClick={()=>onPageSelect(6)}> <i className="bi bi-person-gear"></i> Support </button>
            <button style={{color: page == 7 ? "#0089BF":"white"}} onClick={()=>onPageSelect(7)}> <i className="bi bi-sliders"></i> Others </button>
        </div>
    </div>
  )
}

export default Sidebar
