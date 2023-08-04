import React, { useState, useRef, useEffect } from 'react'
import SignatureCanvas from 'react-signature-canvas';
import { getFirestore } from "firebase/firestore";
import { app } from '../Firebase.js'
import { doc, getDoc } from "firebase/firestore";
import { useLocation } from 'react-router-dom';


function Sheet1() {
    const db = getFirestore(app);
    const location = useLocation();
    const {search } = location;
    const params = new URLSearchParams(search);

    const [data, setData] = useState([])
    const [printDoc, setPrintDoc] = useState(false)
    const [scaled, setScaled] = useState(false)

    // Function to handle scaling

    useEffect(()=>{
        getData()
        checkActions()
    },[])

    async function getData() {
        try {
          const docRef = doc(db, "documents", params.get('id'));
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setData(docSnap.data())
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
    }

    function checkActions(){
      let print = params.get('print');
      print == 'true' ? setPrintDoc(true):setScaled(true);      
    }


    function printDocument(){
        if(printDoc){
          window.print();
        }
    }

  return (
    <div className='wrapper-sheet1'>
        <div className='content'>
            <div className='header'>
                <img  src='https://res.cloudinary.com/dxfi1vj6q/image/upload/v1682964660/Final_Logo_1_byrdtx.png' />
            </div>
            <h2> Document Title   </h2>
            <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut nunc quis est dapibus venenatis. Cras sit amet ultrices lorem. Integer tincidunt vehicula dui, vel sagittis tortor consequat ut. Nunc et felis massa. Maecenas rhoncus orci a massa cursus, nec congue lorem mollis. Quisque ut arcu in libero dapibus auctor. Sed consectetur feugiat ipsum, et congue velit tristique.</p>
            <br className='space'></br>
            <p> Suspendisse ac dolor at mauris feugiat laoreet. Vivamus euismod sapien nec nibh tincidunt dignissim. Duis in dapibus ligula. Etiam ut venenatis elit. Pellentesque id pharetra velit, a tristique massa. Nam nec neque non odio convallis vestibulum. Suspendisse nec nunc vel turpis interdum tincidunt nec nec turpis. Nulla facilisi.Vestibulum convallis congue enim, nec blandit nunc cursus et. Fusce mollis odio nec arcu cursus, a gravida eros varius. Praesent nec odio quis risus facilisis fringilla. Integer eleifend felis id metus auctor, ut dignissim velit tristique. Ut sed ante ac ipsum dictum dignissim. Aenean condimentum auctor nulla, ut scelerisque tellus bibendum id. Suspendisse et nunc nec mauris suscipit consectetur in non arcu. </p>
            <p> Suspendisse ac dolor at mauris feugiat laoreet. Vivamus euismod sapien nec nibh tincidunt dignissim. Duis in dapibus ligula. Etiam ut venenatis elit. Pellentesque id pharetra velit, a tristique massa. Nam nec neque non odio convallis vestibulum. Suspendisse nec nunc vel turpis interdum tincidunt nec nec turpis. Nulla facilisi.Vestibulum convallis congue enim, nec blandit nunc cursus et. Fusce mollis odio nec arcu cursus, a gravida eros varius. Praesent nec odio quis risus facilisis fringilla. Integer eleifend felis id metus auctor, ut dignissim velit tristique. Ut sed ante ac ipsum dictum dignissim. Aenean condimentum auctor nulla, ut scelerisque tellus bibendum id. Suspendisse et nunc nec mauris suscipit consectetur in non arcu. </p>
            <br className='space'></br>
            <p> Suspendisse ac dolor at mauris feugiat laoreet. Vivamus euismod sapien nec nibh tincidunt dignissim. Duis in dapibus ligula. Etiam ut venenatis elit. Pellentesque id pharetra velit, a tristique massa. Nam nec neque non odio convallis vestibulum. Suspendisse nec nunc vel turpis interdum tincidunt nec nec turpis. Nulla facilisi.Vestibulum convallis congue enim, nec blandit nunc cursus et. Fusce mollis odio nec arcu cursus, a gravida eros varius. Praesent nec odio quis risus facilisis fringilla. Integer eleifend felis id metus auctor, ut dignissim velit tristique. Ut sed ante ac ipsum dictum dignissim. Aenean condimentum auctor nulla, ut scelerisque tellus bibendum id. Suspendisse et nunc nec mauris suscipit consectetur in non arcu. </p>
            <div className='sign'>
                <img src={data.sign} onLoad={()=>printDocument()}/>
                <p> {data.name} </p>
                <p> {data.date} </p>
            </div>
        </div>  
    </div>
  )
}

export default Sheet1