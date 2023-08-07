import React, { useState, useRef, useEffect } from 'react'
import SignatureCanvas from 'react-signature-canvas';
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { app } from '../Firebase.js';
import { doc, setDoc } from "firebase/firestore"; 

function Document() {
    const db = getFirestore(app);
    const [sign, setSign] = useState(null)
    const [mySign, setMySign] = useState()
    const [showPopup, setShowPopup] = useState(false)
    const [fullName, setFullName] = useState("")
    const [showSave, setShowSave] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false)


    function clearSign(){
        sign.clear();
    }
    function storeSign(){
        setShowPopup(false)
        const signatureData = sign.toDataURL();
        setMySign(signatureData)
    }
    function formatDate(date) {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
      }
    
    async function handleSave(){
        let data = { 
            name: fullName,
            title: "Document 1",
            date: formatDate(new Date()),
            sign : sign.getTrimmedCanvas().toDataURL('image/png').toString()
        }
        try {
            await addDoc(collection(db, "documents"), data);
            setShowConfirmation(true)
          } 
        catch (error) {
            alert("You are missing some fields.")
        }
    }

    useEffect(()=>{
        if (sign) {
            const isCanvasEmpty = sign.isEmpty();
            setShowSave(false)
            if (!isCanvasEmpty && fullName.length > 8) {
              setShowSave(true)
            }
        }
    })

  return (
    <div className='wrapper-document'>
        <div className='content'>
            <div className='header'>
                <img src='https://res.cloudinary.com/dxfi1vj6q/image/upload/v1682964660/Final_Logo_1_byrdtx.png' />
            </div>

            <p> 1. <b>THE PARTIES.</b> This Short-Term Rental Agreement (“Agreement”) made on <input className='in-text' id="in1" type='text'/>,20 <input className='in-text' id="in2" type='text'/> betweeen the following: </p>
            <p> TENANT:  <input id="in3"  className="in-text" type='text'/> , with a mailing address of  <input id="in4"  className="in-text" type='text'/> ("Tenant"), and LANDLORD:  <input id="in5"  className="in-text" type='text'/>, with a mailing address of  <input id="in6"  className="in-text" type='text'/> ("Landlord").</p>
            <br></br>
            <p> 2. <b>THE PREMISES.</b> The Landlord agrees to lease the described property below to the Tenant, and the Tenant agrees to rent from the Landlord. </p>
            <br></br>
            <p> a.) Mailing Address:  <input id="in7"  className="in-text" type='text'/>. </p>
            <p> b.) Residence Type: <input id="rad" className="in-rad"  type='radio' /> Apartment <input id="rad" className="in-rad"  type='radio' /> House <input id="rad" className="in-rad"  type='radio' /> Condo <input id="rad" className="in-rad"  type='radio' /> Other  <input id="in8"  className="in-text" type='text'/>. </p>
            <p> c.) Bedroom(s): <input id="in9"  className="in-text" type='text'/> </p>
            <p> d.) Bathroom(s): <input id="in10"  className="in-text" type='text'/></p>
            <p> e,) Other:  <input id="in11"  className="in-text" type='text'/>.</p>
            <br></br>
            <p> Here in after known as the "Premises".</p>
            <br></br>
            <p> 3. <b>LEASE TERM.</b> The Tenant shall have access to the Premises under the terms of this Agreement for the following time period: (check one)</p>
            <br></br>
            <p className='indent'><input id="rad1" className="in-rad" type='radio'/><b>-  Fixed Term. </b> The Tenant shall be allowed to occupy the Premises starting  <input id="in12"  className="in-text" type='text'/>, 20<input id="in13"  className="in-text" type='text'/>  at  <input id="in14" className="in-text" type='text'/> :  <input id="in15"  className="in-text" type='text'/><input id="rad" className="in-rad"  type='radio' />AM <input id="rad" className="in-rad"  type='radio' />PM and ending  <input id="in16"  className="in-text" type='text'/>, 20  <input id="in17"  className="in-text" type='text'/> at  <input id="in18"  className="in-text" type='text'/> :  <input id="in19"  className="in-text" type='text'/> <input id="rad" className="in-rad"  type='radio' />AM <input id="rad" className="in-rad"  type='radio' />PM ("Leasing Term").</p>
            <br></br>
            <p className='indent'><input id="rad2" className="in-rad"  type='radio' /><b> - Month-to-Month Lease.</b> The Tenant shall be allowed to occupy the Premises on a month-to-month arrangement starting on  <input id="in20"  className="in-text" type='text'/>, 20  <input id="in21"  className="in-text" type='text'/>, and ending upon notice of  <input id="in22"  className="in-text" type='text'/> days from either Party to the other Party ("Lease Term"). </p>
            <br></br>
            <p> 4. <b> QUIET HOURS.</b> The Landlord requires: (check one)</p>
            <br></br>
            <p className='indent'> <input id="rad" className="in-rad"  type='radio' /> <b> -  No Quiet Hours. </b> There are no quiet hours. However, the Tenant must reside on the Premises with respect to the quiet enjoyment of the surrounding residents. </p>
            <br></br>
            <p className='indent'> <input id="rad" className="in-rad"  type='radio' /> <b>-  Quiet Hours. </b> Quiet hours begin at  <input id="in23"  className="in-text" type='text'/>:<input id="in24"  className="in-text" type='text'/> <input id="rad" className="in-rad"  type='radio' />AM <input id="rad" className="in-rad"  type='radio' />PM each night and continue until sunrise. Quiet hours consist of no music and keeping all audio at a minimum level out of respect for the surrounding residents.</p>
            <br></br>
            <p> 5.  <b> OCCUPANTS.</b>  The total number of individuals staying on the Premises during the Lease Term shall be a total of <input id="in25"  className="in-text" type='text'/> guests.</p>
            <p> If more than the authorized number of guests listed above are found on the Premises, this Agreement will be subject to termination by the Landlord. </p>
            <br></br>
            <p> 6. <b> RENT. </b> The Tenant shall pay the Landlord:</p>
            <br></br>
            <p className='indent'><input id="rad" className="in-rad"  type='radio' /> <b> -  Fixed Amount.</b> The Tenant shall be required to pay the Landlord </p>
            <p className='indent'><b>$</b><input id="in26"  className="in-text" type='text'/> for the Lease Term (“Rent”). The Rent is due at the execution of this Agreement.</p>
            <br></br>
            <p className='indent'><input id="rad" className="in-rad"  type='radio' /> <b> -  Monthly Amount.</b> The Tenant shall be required to pay the Landlord </p>
            <p className='indent'><b>$</b><input id="in27"  className="in-text" type='text'/>  in equal monthly installments for the Lease Term (“Rent”) and due on the <input id="in28"  className="in-text" type='text'/> of each month under the following instructions: <input id="in29"  className="in-text" type='text'/>. </p>
            <br></br>
            <p className='indent'> First (1st) month’s rent is due at the execution of this Agreement.</p>
            <br></br>
            <p> 7. <b> UTILITIES.</b> The Landlord shall be responsible for all utilities and services to the Premises EXCEPT for the following: <input id="in30"  className="in-text" type='text'/>.</p>
            <br></br>
            <p> 8. <b> SECURIT DEPOSIT.</b> The Tenant shall be obligated to pay the following amounts upon the execution of this Agreement: (check one)</p>
            <br></br>
            <p className='indent'><input id="rad" className="in-rad"  type='radio' /> <b> No Security Deposit.</b> There is no deposit required for the security of this Agreement (“Security Deposit”). </p>
            <br></br>
            <p className='indent'><input id="rad" className="in-rad"  type='radio' /> <b> Security Deposit: $</b><input id="in31"  className="in-text" type='text'/> (“Security Deposit”). The Security Deposit is for the faithful performance of the Tenant under the terms and conditions of this Agreement. The Tenant must pay the Security Deposit at the execution of this Agreement. The Security Deposit shall be returned to the Tenant within the State's requirements after the end of the Lease Term less any itemized deductions. This Security Deposit shall not be credited towards any Rent unless the Landlord gives their written consent. </p>
            <br></br>
            <p>9. <b> PETS. </b> The Landlord: (check one)</p>
            <br></br>
            <p className='indent'><input id="rad" className="in-rad"  type='radio' /> <b> Does Not Allow Pets: </b> There are no pets allowed on the Premises. If the Tenant is found to have pets on the Premises, this Agreement and any Security Deposit shall be forfeited. </p>
            <br></br>
            <p className='indent'><input id="rad" className="in-rad"  type='radio' /><b> Allows Pets: </b> The Tenant shall have the right to have <input id="in32"  className="in-text" type='text'/> pet(s) on the Premises with a maximum limit of <input id="in33"  className="in-text" type='text'/> pounds per pet. For the right to have pet(s) on the Premises, the Landlord shall charge a fee of </p>
            <p className='indent'><b>$</b><input id="in34"  className="in-text" type='text'/> that is <input id="rad" className="in-rad"  type='radio' /> non-refundable <input id="rad" className="in-rad"  type='radio' /> refundable unless there are damages related to the pet. The Tenant is responsible for all damage that any pet causes, regardless of the ownership of said pet, and agrees to restore the Premises to its original condition at their expense.</p>
            <br></br>
            <p> 10. <b>PARKING. </b> The Landlord: (check one)</p>
            <br></br>
            <p className='indent'><input id="rad" className="in-rad"  type='radio' /> <b> Shall provide </b><input id="in35"  className="in-text" type='text'/> parking space(s) to the Tenant for a fee of $<input id="in36"  className="in-text" type='text'/> to be paid <input id="rad" className="in-rad"  type='radio' /> at the execution of this Agreement <input id="rad" className="in-rad"  type='radio' /> on a monthly basis in addition to the rent. The parking space(s) are described as: [DESCRIBE PARKING SPACES] <input id="in37"  className="in-text" type='text'/>. </p>
            <br></br>
            <p className='indent'><input id="rad" className="in-rad"  type='radio' /> <b> Shall Not </b> provide parking.</p>  
            <br></br>
            <p> 11. <b> FEES. </b> The Landlord requires the Tenant pays the following fees at the execution of this Agreement: (check all that apply)</p>
            <br></br>
            <p className='indent'><input id="rad" className="in-rad"  type='radio' /><b> Cleaning Fee: </b>$<input id="in38"  className="in-text" type='text'/> </p>
            <p className='indent'><input id="rad" className="in-rad"  type='radio' /><b> Taxes: </b>$<input id="in39"  className="in-text" type='text'/> </p>
            <p className='indent'><input id="rad" className="in-rad"  type='radio' /><b> Other.</b><input id="in40"  className="in-text" type='text'/> $ <input id="in41"  className="in-text" type='text'/>. </p>
            <p className='indent'><input id="rad" className="in-rad"  type='radio' /><b> Other.</b><input id="in42"  className="in-text" type='text'/> $ <input id="in43"  className="in-text" type='text'/>. </p>
            <br></br>
            <p> 12. <b> PARTY CLEANUP.</b> If the Premises qualifies for a “deep clean” due to the amount of “wear and tear” from a party or large gathering, a fee of $ <input id="in44"  className="in-text" type='text'/> (“Party Cleanup Fee”) shall be charged at the end of the Lease Term. The Party Cleanup Fee may be deducted from the Security Deposit.</p>
            <br></br>
            <p> 13. <b> SMOKING POLICY. </b>  Smoking on the Premises is: (check one) </p>
            <br></br>
            <p className='indent'><input id="rad" className="in-rad"  type='radio' /> <b> - Prohibited </b></p>
            <p className='indent'><input id="rad" className="in-rad"  type='radio' /> <b> - Prohibited </b>ONLY in the following areas: </p>
            <p className='indent'><input id="in45"  className="in-text" type='text'/> .</p>
            <br></br>
            <p> 14. <b> PERSON OF CONTACT. </b> The Landlord: (check one) </p>
            <br></br>
            <p className='indent'><input id="rad" className="in-rad"  type='radio' /> <b> - Does </b> have a manager on the Premises that can be contacted for any maintenance or repair at:</p>
            <p className='indent'>Agent/Manager’s Name:  <input id="in46"  className="in-text" type='text'/> .</p>
            <p className='indent'>Telephone:  <input id="in47"  className="in-text" type='text'/> .</p>
            <p className='indent'>E-mail:  <input id="in48"  className="in-text" type='text'/> .</p>
            <br></br>
            <p className='indent'><input id="rad" className="in-rad"  type='radio' /> <b> - Does not </b> have an agent/manager on the Premises, although the Landlord can be contacted for any emergency, maintenance, or repair at: </p>
            <p className='indent'>Landlord's Name:  <input id="in49"  className="in-text" type='text'/> .</p>
            <p className='indent'>Telephone:  <input id="in50"  className="in-text" type='text'/> .</p>
            <p className='indent'>E-mail:  <input id="in51"  className="in-text" type='text'/> .</p>
            <br></br>
            <p> 15. <b> SUBLETING. </b> The Tenant: (check one) </p>
            <p className='indent'><input id="rad" className="in-rad"  type='radio' /><b> - Has </b> the right to sublet the Premises. Each subtenant is: (check one) </p>
            <p className='indent'><input id="rad" className="in-rad"  type='radio' />  required to be approved by the Landlord prior to occupancy. </p>
            <p className='indent'><input id="rad" className="in-rad"  type='radio' />  not required to be approved by the Landlord.  </p>
            <p className='indent'><input id="rad" className="in-rad"  type='radio' /><b> - Does not </b> have the right to sublet the Premises.</p>
            <br></br>
            <p> 16. <b> MOVE-IN INSPECTION. </b> Before, at the time of the Tenant accepting possession, or shortly thereafter, the Landlord and Tenant shall: (check one) </p>
            <p className='indent'><input id="rad" className="in-rad"  type='radio' /><b> - Inspect </b> the Premises and write any present damages or needed repairs on a move-in checklist.</p>
            <p className='indent'><input id="rad" className="in-rad"  type='radio' /><b> - Shall not </b>  inspect the Premises or complete a move-in checklist </p>
            <br></br>
            <p>17.<b> INSPECTION.</b> The Landlord has the right to inspect the Premises with prior notice as in accordance with State law. Should the Tenant violate any of the terms of this Agreement, the rental period shall be terminated immediately in accordance with State law. The Tenant waives all rights to process if they fail to vacate the premises upon termination of the rental period. The Tenant shall vacate the Premises at the expiration time and date of this agreement.</p>
            <br></br>
            <p>18. <b> MAINTENANCE AND REPAIRS.</b> The Tenant shall maintain the Premises in a good, clean, and ready-to-rent condition and use the Premises only in a careful and lawful manner. The Tenant shall leave the Premises in a ready to rent condition at the expiration of this Agreement, defined by the Landlord as being immediately habitable by the next tenant. The Tenant shall pay for maintenance and repairs should the Premises be left in a lesser condition. The Tenant agrees that the Landlord shall deduct costs of said services from any Security Deposit prior to a refund if Tenant causes damage to the Premises or its furnishings.</p>
            <br></br>
            <p>19. <b> TRASH. </b>  The Tenants shall dispose of all waste material generated during the Lease Term under the strict instruction and direction of the Landlord. </p>
            <br></br>
            <p>20. <b> QUIET ENJOYMENT. </b> The Tenant, along with neighbors, shall enjoy each other’s company in a quiet and respectful manner to each other’s enjoyment. The Tenant is expected to behave in a civilized manner and shall be good neighbors with any residents of the immediate area. Creating a disturbance of the area by large gatherings or parties shall be grounds for immediate termination of this Agreement.</p>
            <br></br>
            <p> 21. <b> LANDLORD’S LIABILITY.</b> he Tenant and any of their guests hereby indemnify and hold harmless the Landlord against any and all claims of personal injury or property damage or loss arising from the use of the Premises regardless of the nature of the accident, injury or loss. The Tenant expressly recognizes that any insurance for property damage or loss which the Landlord may maintain on the property does not cover the personal property of Tenant and that Tenant should purchase their own insurance for their guests if such coverage is desired.</p>
            <br></br>
            <p> 22. <b> ATTORNEY’S FEES. </b> The Tenant agrees to pay all reasonable costs, attorney's fees, and expenses that shall be made or incurred by the Landlord enforcing this agreement. </p>
            <br></br>
            <p>23. <b> USE OF PREMISES.</b>  The Tenant shall use the Premises for residential use only. The Tenant is not authorized to sell products or services on the Premises or conduct any commercial activity. </p>
            <br></br>
            <p> 24. <b> ILLEGAL ACTIVITY. </b> The Tenant shall use the Premises for legal purposes only. Any other such use that includes but is not limited to illicit drug use, verbal or physical abuse of any person or illegal sexual behavior shall cause immediate termination of this Agreement with no refund of pre-paid Rent.</p>
            <br></br>
            <p> 25. <b> POSSESSIONS. </b> Any personal items or possessions that are left on the Premises are not the responsibility of the Landlord. The Landlord shall make every reasonable effort to return the item to the Tenant. If claims are not made within the State’s required time period or two (2) weeks, whichever is shorter, the Landlord shall be able to keep such items to sell or for personal use. </p>
            <br></br>
            <p> 26. <b> GOVERNING LAW. </b> This Agreement shall be governed and subject to the laws located in the jurisdiction of Premise’s location. </p>
            <br></br>

            <p> <b> Landlord Signature:</b> <input id="in52"  className="in-text" type='text'/> Date: <input id="in53"  className="in-text" type='text'/></p>
            <p> Print Name: <input id="in54"  className="in-text" type='text'/></p>
            <br></br>
            <p> <b> Tenant Signature:</b> <input id="in55"  className="in-text" type='text'/> Date: <input id="in56"  className="in-text" type='text'/></p>
            <p> Print Name: <input id="in57"  className="in-text" type='text'/></p>
            <br></br>
            <p> <b> Tenant Signature:</b> <input id="in58"  className="in-text" type='text'/> Date: <input id="in59"  className="in-text" type='text'/></p>
            <p> Print Name: <input id="in60"  className="in-text" type='text'/></p>




            <div className='sign'>
                <img src={mySign} />
                <p> {fullName} </p>
            </div>
        </div>
        <div className='floatingBtns'>
            <button id="sign" onClick={()=> setShowPopup(true)}> <i className="bi bi-pencil-square"></i>  Sign </button>
            <button id="save"  style={{display: showSave ? "block":"none"}} onClick={()=> handleSave()}> Save <i className="bi bi-chevron-right"></i> </button>
        </div>
        <div className='overlay'  style={{display: showPopup? "block":"none"}} onClick={()=>setShowPopup(false)}></div>
        <div className='sign-pad' style={{display: showPopup? "block":"none"}}>
            <div className='pad'>
            <SignatureCanvas 
                canvasProps={{width: 720, height: 300, className: 'sigCanvas'}} 
                ref={sign=>setSign(sign)}
            ></SignatureCanvas>
            </div>
            <input type='text' placeholder='Full Name' onChange={(e)=>setFullName(e.target.value)}></input>
            <div className='actions'>
                <button style={{display: fullName.length > 8? "block":"none"}} onClick={()=>storeSign(false)}id="save"> Save </button>
                <button id="cancel" onClick={()=>clearSign()}> Clear </button>
            </div>
        </div>
        <div className='confirmation' style={{display: showConfirmation? "flex":"none"}}>
            <div className='confirmation-content'>
                <i className="bi bi-check2-circle checkIcon"></i>
                <h2> Thanks !</h2>
                <p> Your document has been sent successfully </p>
            </div>
        </div>
    </div>
  )
}

export default Document