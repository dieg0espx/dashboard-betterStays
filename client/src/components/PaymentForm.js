import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import axios from "axios"
import React, { useEffect, useState } from 'react'
import { app } from '../Firebase.js';
import { doc, setDoc, getDoc, getFirestore, updateDoc } from "firebase/firestore"; 

const CARD_OPTIONS = {
	style: {
        base: {
          color: "#32325d",
          fontFamily: "Arial, sans-serif",
          fontSmoothing: "antialiased",
          fontSize: "20px",
          "::placeholder": {
            color: "#aab7c4",
          },
        },
        icon: {
          color: "#0089BF",
        },
    },
};
const MOBILE_CARD_OPTIONS = {
	style: {
        base: {
          color: "#32325d",
          fontFamily: "Arial, sans-serif",
          fontSmoothing: "antialiased",
          fontSize: "15px",
          "::placeholder": {
            color: "#aab7c4",
          },
        },
        icon: {
          color: "#0089BF",
        },
    },
};

function PaymentForm(props) {
    const db = getFirestore(app);
    const [success, setSuccess ] = useState(false)
    const stripe = useStripe()
    const elements = useElements()

    const [showBtn, setShowBtn] = useState(true);
    const [failed, setFailed] = useState(false);
    const [error, setError] = useState('')

    const [showConfirmation, setShowConfirmation] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(()=>{
      setShowConfirmation(props.paid)
      console.log(showConfirmation);
      if(window.innerWidth < 800){setIsMobile(true)}
    },[props.paid])
    

  const handleSubmit = async (e) => {
      // PROCESSING PAYMENT WITH STRPE
      e.preventDefault()
      const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement)
      })
      if(!error) {
          try {
              const {id} = paymentMethod
              const response = await axios.post("https://seccond-stripe-payments.vercel.app/payment", {
                id, 
                amount: Math.floor(props.balance*100),
                description: "EXTRA INVOICE" , 
                propertyName: "Tuneberg"
              })
              if (response.data.success) {
                console.log("Payment Successfull !");
                setShowConfirmation(true)
                const invoiceRef = doc(db, "Invoices", props.invoiceID);
                await updateDoc(invoiceRef, {
                  paid: true
                });

              } else {
                // if the payment fails
              }
          } catch (error) {
            console.log("Error", error)
          }
      } else {
          console.log(error.message)
          setError(error.message)
          setFailed(true)
          setShowBtn(true)
      }
  }

    return (
        <>
        {!success ? 
        <form onSubmit={handleSubmit}>
            <div className="card-details">
                <fieldset className="FormGroup">
                    <div className="FormRow">
                        <CardElement options={isMobile? MOBILE_CARD_OPTIONS:CARD_OPTIONS}/>
                    </div>
                </fieldset>
            </div>
            <div style={{display: failed? "block":"none"}}>
                <p id="failed"> *Payment failed, try again. </p>
                <p id="failed"> {error} </p>
            </div>
            <div style={{display: showBtn? "block":"none"}}>
                <button id="btnPay" onClick={()=>setShowBtn(false)}>Pay ${props.balance} USD</button>
            </div>
        </form>:""
        }     
          <div>
             <div className='paymentForm-confirmation' style={{display: showConfirmation ? "flex":"none"}}>
               <i className="bi bi-check-circle-fill iconCheck"></i>
               <h2> Thanks !</h2>
               <p> This invoice has been successfully paid </p>
             </div>
          </div> 
        </>
    )
}

export default PaymentForm;


