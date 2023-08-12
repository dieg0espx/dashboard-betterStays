import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import axios from "axios"
import React, { useEffect, useState } from 'react'

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

function PaymentForm(props) {
    const [success, setSuccess ] = useState(false)
    const stripe = useStripe()
    const elements = useElements()

    const [showBtn, setShowBtn] = useState(true);
    const [failed, setFailed] = useState(false);
    

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
              } else {
                // if the payment fails
              }
          } catch (error) {
            console.log("Error", error)
          }
      } else {
          console.log(error.message)
      }
  }

    return (
        <>
        {!success ? 
        <form onSubmit={handleSubmit}>
            {/* <h3> Payment </h3> */}
            <div className="card-details">
                <fieldset className="FormGroup">
                    <div className="FormRow">
                        <CardElement options={CARD_OPTIONS}/>
                    </div>
                </fieldset>
            </div>
            <div style={{display: failed? "block":"none"}}>
                <p id="failed"> *Payment Failed </p>
            </div>
            <div style={{display: showBtn? "block":"none"}}>
                <button id="btnPay" onClick={()=>setShowBtn(false)}>Pay ${props.balance} USD</button>
            </div>
        </form>
        :
       <div>
            <p> Done ! </p>
       </div> 
        }     
        </>
    )
}

export default PaymentForm;


