import {React, useEffect, useState} from 'react'
import Sidebar from '../components/Sidebar';
import { getFirestore, collection, query, getDocs, setDoc } from 'firebase/firestore';
import { app } from '../Firebase';
import { doc, getDoc } from "firebase/firestore";
import { logDOM } from '@testing-library/react';

function Support() {
  const db = getFirestore(app);
  const [questions, setQuestions] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState([])
  const [currentAnswer, setCurrentAnswer] = useState("")

  useEffect(()=>{
    getQuestions()
  },[])

  async function getQuestions(){
    try {
      const q = query(collection(db, "Questions"));
      let data = []
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
       data.push({id: doc.id, question: doc.data().question, answer: doc.data().answer});
      });
      setQuestions(data)
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
  }

  function updateQuestion(id, question, answer){
    let popupQuestion = [id, question, answer]
    setCurrentQuestion(popupQuestion);
    setCurrentAnswer(popupQuestion[2])
    setShowPopup(true)
  }

  async function saveQuestion(id){
    console.log(id);
    let dataToPush = { 
     question: currentQuestion[1],
     answer: currentAnswer,
     isAnswered : currentAnswer.length > 10 ? true : false
    }
    try {
      await setDoc(doc(db, "Questions", id), dataToPush);
      setShowPopup(false)
      getQuestions()
    } 
    catch (error) {
      alert("You are missing some fields." + error)
    }
  }
  
  return (
    <div className='wrapper-supportPage'>
        <div>
            <Sidebar />
        </div>
        <div>
            <div className="top-nav">
              <h2> Support  </h2>
            </div>
            <div className='content'>
            {questions.map((question) => (
              <div className='question-row' key={question.id} onClick={()=> updateQuestion(question.id, question.question, question.answer)}>
                  <p id="question"> {question.question} </p>
                  <p id="answer"> {question.answer} </p>
              </div>
            ))}
            </div>
            <div className='overlay' style={{display: showPopup? "block":"none"}} onClick={()=>setShowPopup(false)}></div>
            <div className='question-popup' style={{display: showPopup? "block":"none"}}>
                <p id="question"> {currentQuestion[1]} </p>
                <textarea rows={10} value={currentAnswer} onChange={(e)=> setCurrentAnswer(e.target.value)}/>
                <button onClick={()=>saveQuestion(currentQuestion[0])}> Save </button>
            </div>
        </div>
    </div>
  )
}

export default Support
