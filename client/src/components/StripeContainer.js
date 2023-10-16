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
  switch (props.destinatary) {
    case 'DAVID':
      stripeTestPromise = loadStripe(David)
      break;
    case 'PJ INVESTMENTS':
      stripeTestPromise = loadStripe(PJInvestments)
      break;
    case 'PHILL':
      stripeTestPromise = loadStripe(Phill)
      break;
    case 'RC HOMES':
      stripeTestPromise = loadStripe(RCHomes)
      break;
    case 'ROCK CITY HOMES':
      stripeTestPromise = loadStripe(RockCity)
      break;
    default:
      console.log("money goes to diego");
      stripeTestPromise = loadStripe("pk_test_51NJ0hELJsUTWMJlYFPcEXiY8E43Kfrj5ecnpYpKIACSLxPCqsdPhYPaaT0knoPmt4wFQERjyolMHJIPrkvnAH1VI00VHrT8oeq");
      break;
  }

  return (
    <Elements stripe={stripeTestPromise}>
        <PaymentForm 
          balance={props.balance} 
          paid={props.paid} 
          invoiceID={props.invoiceID} 
          title={props.title}
          description={props.description}
          name={props.name}
          email={props.email}
        />
    </Elements>
  )
}

export default StripeContainer
