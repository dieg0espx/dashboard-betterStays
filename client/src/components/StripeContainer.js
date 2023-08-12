import React, { useEffect } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import PaymentForm from './PaymentForm'

const Diego = process.env.REACT_APP_DIEGO_API_KEY;
const David = process.env.REACT_APP_DAVID_API_KEY;
const PJInvestments = process.env.REACT_APP_PJINVESTMENTS_API_KEY;
const Phill = process.env.REACT_APP_PHILL_API_KEY;
const RCHomes = process.env.REACT_APP_RCHOMES_API_KEY;
const RockCity = process.env.REACT_APP_ROCKCITY_API_KEY;


function StripeContainer(props) {

  let stripeTestPromise = loadStripe("pk_test_51NJ0hELJsUTWMJlYFPcEXiY8E43Kfrj5ecnpYpKIACSLxPCqsdPhYPaaT0knoPmt4wFQERjyolMHJIPrkvnAH1VI00VHrT8oeq");

  return (
    <Elements stripe={stripeTestPromise}>
        <PaymentForm 
          balance={props.balance} 
        />
    </Elements>
  )
}

export default StripeContainer
