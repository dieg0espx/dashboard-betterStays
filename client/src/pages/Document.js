import React, { useState, useRef, useEffect } from 'react'
import SignatureCanvas from 'react-signature-canvas';
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { app } from '../Firebase.js';
import { doc, setDoc, getDoc } from "firebase/firestore"; 
import { useLocation, useSearchParams } from 'react-router-dom';

function Document() {
    const db = getFirestore(app);
    
    const [fullName, setFullName] = useState("")
    const [showSave, setShowSave] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [docID, setDocID] = useState("");

    const [inputs, setInputs] = useState(Array(60).fill(''));
    const [radios, setRadios] = useState(Array(42).fill(false));

    const location = useLocation();
    const {search } = location;
    const params = new URLSearchParams(search);

    const [data, setData] = useState([]) // - FIREBASE DATA 

    const [showOverlay, setShowOverlay] = useState(false)

    const [showPopup1, setShowPopup1] = useState(false)
    const [nameTenant1, setNameTenant1] = useState('')
    const [signTenant1, setSignTenant1] = useState(null)
    const [currentTenantSign1, setCurrentSignTenand1] = useState()
    
    const [showPopup2, setShowPopup2] = useState(false)
    const [nameTenant2, setNameTenant2] = useState('')
    const [signTenant2, setSignTenant2] = useState(null)
    const [currentTenantSign2, setCurrentSignTenand2] = useState()


    const [showPopup3, setShowPopup3] = useState(false)
    const [nameLandlord, setNameLandlord] = useState('')
    const [signLandlord, setSignLandlord] = useState(null)
    const [currentLandlordSign, setCurrentLandlordSign] = useState()

    const [saveNewSign, setSaveNewSign] = useState([])

    const [isMobile, setIsMobile] = useState(false)
    const [adminAccess, setAdminAccess] = useState(false)


    // ==== GENERAL FUNCTIONS ===== //
    useEffect(()=>{
        setDocID(params.get('id'))
        getData()
        if(window.innerWidth < 800){setIsMobile(true)}
        
        if(params.get('adminAccess')){
          setAdminAccess(true)
        }
        

    },[])

    function formatDate(date) {
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    }

    // ====  STORING INPUTS AND RADIOS ==== // 
    const handleInputChange = (index, value) => {
        const newInputs = [...inputs];
        newInputs[index] = value;
        setInputs(newInputs);
    };
    const handleRadioChange = (index) => {
      const newRadios = [...radios];
      newRadios[index] = !newRadios[index];
      setRadios(newRadios);
    };

    
    //  ==== SIGNATURES ====  // 
    function clearSign(signID){
      switch (signID) {
        case 1:
          signTenant1.clear()
          break;
        case 2:
          signTenant2.clear()
          break;
        case 3:
          signLandlord.clear()
          break;
        default:
          console.log("SIGNER NOT FOUND");
          break;
      }
    }

    function openSigner(signID){
      setShowOverlay(true)
      switch (signID) {
        case 1:
          setShowPopup1(true)
          setShowPopup2(false)
          setShowPopup3(false)
          break;
        case 2:
          setShowPopup1(false)
          setShowPopup2(true)
          setShowPopup3(false)
          break;
        case 3:
          setShowPopup1(false)
          setShowPopup2(false)
          setShowPopup3(true)
          break;
        default:
          break;
      }
    }

    function storeSign(signID){
        setShowOverlay(false)  
        setShowPopup1(false)
        setShowPopup2(false)
        setShowPopup3(false)
        
        let signatureData;
        switch (signID) {
          case 1:
            signatureData = signTenant1.toDataURL();
            saveNewSign.push(1)
            setCurrentSignTenand1(signatureData)
            break;
          case 2:
            signatureData = signTenant2.toDataURL();
            saveNewSign.push(2)
            setCurrentSignTenand2(signatureData)
            break;
          case 3:
            signatureData = signLandlord.toDataURL();
            saveNewSign.push(3)
            setCurrentLandlordSign(signatureData)
            break;
          default:
            console.log("SIGNER NOT FOUND");
            break;
        }
    }

    function closeSigners() {
        setShowOverlay(false)
        setShowPopup1(false)
        setShowPopup2(false)
        setShowPopup3(false)
    }

    // FIREBASE - UPDATE 
    async function handleSave(){
        let dataToPush = { 
            title: "Contract",
            date: formatDate(new Date()),
            nameTenant1 : nameTenant1,
            signTenant1 : saveNewSign.includes(1) ? signTenant1.getTrimmedCanvas().toDataURL('image/png').toString() : data.signTenant1,
            nameTenant2 : nameTenant2,
            signTenant2 : saveNewSign.includes(2) ? signTenant2.getTrimmedCanvas().toDataURL('image/png').toString() : data.signTenant2,
            nameLandlord : nameLandlord,
            signLandlord: saveNewSign.includes(3) ? signLandlord.getTrimmedCanvas().toDataURL('image/png').toString() : data.signLandlord,
            input: inputs, 
            radios, radios, 
            status:'available'
        }
        try {
            await setDoc(doc(db, "Documents", docID), dataToPush);
            setShowConfirmation(true)
            console.log("Document Saved");
          } 
        catch (error) {
            alert("You are missing some fields.")
        }
    }
  
    // FIREBASE - GET 
    async function getData() {
        try {
          const docRef = doc(db, "Documents", params.get('id'));
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            // console.log(docSnap.data());
            setData(docSnap.data());
            setInputs(docSnap.data().input)
            setRadios(docSnap.data().radios)
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
    }

    useEffect(()=>{
        setNameTenant1(data.nameTenant1)
        setCurrentSignTenand1(data.signTenant1)
        setSignTenant1(data.signTenant1)
  
        setNameTenant2(data.nameTenant2)
        setCurrentSignTenand2(data.signTenant2)
        setSignTenant2(data.signTenant2)
  
        setNameLandlord(data.nameLandlord)
        setCurrentLandlordSign(data.signLandlord)
        setSignLandlord(data.signLandlord)
    }, [data])

    useEffect(()=>{
      console.log(adminAccess);
      var radioButtons = document.querySelectorAll('input[type="radio"]');
      if(!adminAccess){
        for (let i = 1; i <= 51; i++) {
          const inputElement = document.getElementById(`in${i}`);
          if (inputElement) {
            inputElement.disabled = true;
          }
        }
        for (var i = 0; i < radioButtons.length; i++) {
            radioButtons[i].disabled = true;
        }
      } else {
        for (let i = 1; i <= 51; i++) {
          const inputElement = document.getElementById(`in${i}`);
          
          if (inputElement) {
            inputElement.disabled = false;
          }
        }
        for (var i = 0; i < radioButtons.length; i++) {
          radioButtons[i].disabled = false;
        }
      }
    },[adminAccess])


    
  return (
    <div className='wrapper-document'>
        <div className='content'>
            <div className='header'>
                <img src='https://res.cloudinary.com/dxfi1vj6q/image/upload/v1682964660/Final_Logo_1_byrdtx.png' />
            </div>

            <p> 1. <b>THE PARTIES.</b> This Short-Term Rental Agreement (“Agreement”) made on <input onChange={(e) => handleInputChange(1, e.target.value)} className='in-text' value={inputs[1]} id="in1" type='text'/>,20 <input className='in-text' value={inputs[2]} onChange={(e) => handleInputChange(2, e.target.value)} id="in2" type='text'/> betweeen the following: </p>
            <p> TENANT:  <input id="in3"  className="in-text" value={inputs[3]} onChange={(e) => handleInputChange(3, e.target.value)} type='text'/> , with a mailing address of  <input id="in4"  className="in-text" value={inputs[4]} onChange={(e) => handleInputChange(4, e.target.value)} type='text'/> ("Tenant"), and LANDLORD:  <input id="in5"  className="in-text"  value={inputs[5]}onChange={(e) => handleInputChange(5, e.target.value)} type='text'/>, with a mailing address of  <input id="in6"  className="in-text" value={inputs[6]} onChange={(e) => handleInputChange(6, e.target.value)} type='text'/> ("Landlord").</p>
            <br></br>
            <p> 2. <b>THE PREMISES.</b> The Landlord agrees to lease the described property below to the Tenant, and the Tenant agrees to rent from the Landlord. </p>
            <br></br>
            <p> a.) Mailing Address:  <input id="in7"  className="in-text" value={inputs[7]} onChange={(e) => handleInputChange(7, e.target.value)} type='text'/>. </p>
            <p> b.) Residence Type: <input id="rad" className="in-rad"  checked={radios[1]} onClick={()=>handleRadioChange(1) } type='radio' /> Apartment <input id="rad" className="in-rad" checked={radios[2]} onClick={()=>handleRadioChange(2)} type='radio' /> House <input id="rad" className="in-rad" checked={radios[3]} onClick={()=>handleRadioChange(3)}  type='radio' /> Condo <input id="rad" className="in-rad" checked={radios[4]} onClick={()=>handleRadioChange(4)} type='radio' /> Other  <input id="in8"  className="in-text" value={inputs[8]} onChange={(e) => handleInputChange(8, e.target.value)} type='text'/>. </p>
            <p> c.) Bedroom(s): <input id="in9"  className="in-text" value={inputs[9]} onChange={(e) => handleInputChange(9, e.target.value)} type='text'/> </p>
            <p> d.) Bathroom(s): <input id="in10"  className="in-text" value={inputs[10]} onChange={(e) => handleInputChange(10, e.target.value)} type='text'/></p>
            <p> e,) Other:  <input id="in11"  className="in-text" value={inputs[11]} onChange={(e) => handleInputChange(11, e.target.value)} type='text'/>.</p>
            <br></br>
            <p> Here in after known as the "Premises".</p>
            <br></br>
            <p> 3. <b>LEASE TERM.</b> The Tenant shall have access to the Premises under the terms of this Agreement for the following time period: (check one)</p>
            <br></br>
            <p className='indent'><input id="rad1" className="in-rad" checked={radios[5]} onClick={()=>handleRadioChange(5)} type='radio'/><b>-  Fixed Term. </b> The Tenant shall be allowed to occupy the Premises starting  <input id="in12"  className="in-text" value={inputs[12]} onChange={(e) => handleInputChange(12, e.target.value)} type='text'/>, 20<input id="in13"  className="in-text" value={inputs[13]} onChange={(e) => handleInputChange(13, e.target.value)} type='text'/>  at  <input id="in14" className="in-text" value={inputs[14]} onChange={(e) => handleInputChange(14, e.target.value)} type='text'/> :  <input id="in15"  className="in-text" value={inputs[15]} onChange={(e) => handleInputChange(15, e.target.value)} type='text'/><input id="rad" className="in-rad"  checked={radios[6]} onClick={()=>handleRadioChange(6)} type='radio' />AM <input id="rad" className="in-rad" checked={radios[7]} onClick={()=>handleRadioChange(7)} type='radio' />PM and ending  <input id="in16"  className="in-text" value={inputs[16]} onChange={(e) => handleInputChange(16, e.target.value)} type='text'/>, 20  <input id="in17"  className="in-text" value={inputs[17]} onChange={(e) => handleInputChange(17, e.target.value)} type='text'/> at  <input id="in18"  className="in-text" value={inputs[18]} onChange={(e) => handleInputChange(18, e.target.value)} type='text'/> :  <input id="in19"  className="in-text"  value={inputs[19]} onChange={(e) => handleInputChange(19, e.target.value)} type='text'/> <input id="rad" className="in-rad"  checked={radios[8]} onClick={()=>handleRadioChange(8)}  type='radio' />AM <input id="rad" className="in-rad"  checked={radios[9]} onClick={()=>handleRadioChange(9)}  type='radio' />PM ("Leasing Term").</p>
            <br></br>
            <p className='indent'><input id="rad2" className="in-rad"  checked={radios[10]} onClick={()=>handleRadioChange(10)} type='radio' /><b> - Month-to-Month Lease.</b> The Tenant shall be allowed to occupy the Premises on a month-to-month arrangement starting on  <input id="in20"  className="in-text" value={inputs[20]} onChange={(e) => handleInputChange(20, e.target.value)} type='text'/>, 20  <input id="in21"  className="in-text" value={inputs[21]} onChange={(e) => handleInputChange(21, e.target.value)} type='text'/>, and ending upon notice of  <input id="in22"  className="in-text" value={inputs[22]} onChange={(e) => handleInputChange(22, e.target.value)} type='text'/> days from either Party to the other Party ("Lease Term"). </p>
            <br></br>
            <p> 4. <b> QUIET HOURS.</b> The Landlord requires: (check one)</p>
            <br></br>
            <p className='indent'> <input id="rad" className="in-rad"  checked={radios[11]} onClick={()=>handleRadioChange(11)} type='radio' /> <b> -  No Quiet Hours. </b> There are no quiet hours. However, the Tenant must reside on the Premises with respect to the quiet enjoyment of the surrounding residents. </p>
            <br></br>
            <p className='indent'> <input id="rad" className="in-rad"  checked={radios[12]} onClick={()=>handleRadioChange(12)} type='radio' /> <b>-  Quiet Hours. </b> Quiet hours begin at  <input id="in23"  className="in-text" value={inputs[23]} onChange={(e) => handleInputChange(23, e.target.value)} type='text'/>:<input id="in24"  className="in-text" value={inputs[24]} onChange={(e) => handleInputChange(24, e.target.value)} type='text'/> <input id="rad" className="in-rad"  checked={radios[13]} onClick={()=>handleRadioChange(13)}  type='radio' />AM <input id="rad" className="in-rad"  checked={radios[14]} onClick={()=>handleRadioChange(14)}  type='radio' />PM each night and continue until sunrise. Quiet hours consist of no music and keeping all audio at a minimum level out of respect for the surrounding residents.</p>
            <br></br>
            <p> 5.  <b> OCCUPANTS.</b>  The total number of individuals staying on the Premises during the Lease Term shall be a total of <input id="in25"  className="in-text" value={inputs[25]} onChange={(e) => handleInputChange(25, e.target.value)} type='text'/> guests.</p>
            <p> If more than the authorized number of guests listed above are found on the Premises, this Agreement will be subject to termination by the Landlord. </p>
            <br></br>
            <p> 6. <b> RENT. </b> The Tenant shall pay the Landlord:</p>
            <br></br>
            <p className='indent'><input id="rad" className="in-rad"  checked={radios[15]} onClick={()=>handleRadioChange(15)}  type='radio' /> <b> -  Fixed Amount.</b> The Tenant shall be required to pay the Landlord </p>
            <p className='indent'><b>$</b><input id="in26"  className="in-text" value={inputs[26]} onChange={(e) => handleInputChange(26, e.target.value)} type='text'/> for the Lease Term (“Rent”). The Rent is due at the execution of this Agreement.</p>
            <br></br>
            <p className='indent'><input id="rad" className="in-rad"  checked={radios[16]} onClick={()=>handleRadioChange(16)}  type='radio' /> <b> -  Monthly Amount.</b> The Tenant shall be required to pay the Landlord </p>
            <p className='indent'><b>$</b><input id="in27"  className="in-text" value={inputs[27]} onChange={(e) => handleInputChange(27, e.target.value)} type='text'/>  in equal monthly installments for the Lease Term (“Rent”) and due on the <input id="in28"  className="in-text" value={inputs[28]} onChange={(e) => handleInputChange(28, e.target.value)} type='text'/> of each month under the following instructions: <input id="in29"  className="in-text" value={inputs[29]} onChange={(e) => handleInputChange(29, e.target.value)} type='text'/>. </p>
            <br></br>
            <p className='indent'> First (1st) month’s rent is due at the execution of this Agreement.</p>
            <br></br>
            <p> 7. <b> UTILITIES.</b> The Landlord shall be responsible for all utilities and services to the Premises EXCEPT for the following: <input id="in30"  className="in-text" value={inputs[30]} onChange={(e) => handleInputChange(30, e.target.value)} type='text'/>.</p>
            <br></br>
            <p> 8. <b> SECURIT DEPOSIT.</b> The Tenant shall be obligated to pay the following amounts upon the execution of this Agreement: (check one)</p>
            <br></br>
            <p className='indent'><input id="rad" className="in-rad"  checked={radios[17]} onClick={()=>handleRadioChange(17)}  type='radio' /> <b> No Security Deposit.</b> There is no deposit required for the security of this Agreement (“Security Deposit”). </p>
            <br></br>
            <p className='indent'><input id="rad" className="in-rad"  checked={radios[18]} onClick={()=>handleRadioChange(18)}  type='radio' /> <b> Security Deposit: $</b><input id="in31"  className="in-text" value={inputs[31]} onChange={(e) => handleInputChange(31, e.target.value)} type='text'/> (“Security Deposit”). The Security Deposit is for the faithful performance of the Tenant under the terms and conditions of this Agreement. The Tenant must pay the Security Deposit at the execution of this Agreement. The Security Deposit shall be returned to the Tenant within the State's requirements after the end of the Lease Term less any itemized deductions. This Security Deposit shall not be credited towards any Rent unless the Landlord gives their written consent. </p>
            <br></br>
            <p>9. <b> PETS. </b> The Landlord: (check one)</p>
            <br></br>
            <p className='indent'><input id="rad" className="in-rad"  checked={radios[19]} onClick={()=>handleRadioChange(19)}  type='radio' /> <b> Does Not Allow Pets: </b> There are no pets allowed on the Premises. If the Tenant is found to have pets on the Premises, this Agreement and any Security Deposit shall be forfeited. </p>
            <br></br>
            <p className='indent'><input id="rad" className="in-rad"  checked={radios[20]} onClick={()=>handleRadioChange(20)}  type='radio' /><b> Allows Pets: </b> The Tenant shall have the right to have <input id="in32"  className="in-text" value={inputs[32]} onChange={(e) => handleInputChange(32, e.target.value)} type='text'/> pet(s) on the Premises with a maximum limit of <input id="in33"  className="in-text" value={inputs[33]} onChange={(e) => handleInputChange(33, e.target.value)} type='text'/> pounds per pet. For the right to have pet(s) on the Premises, the Landlord shall charge a fee of </p>
            <p className='indent'><b>$</b><input id="in34"  className="in-text" value={inputs[34]} onChange={(e) => handleInputChange(34, e.target.value)} type='text'/> that is <input id="rad" className="in-rad"  checked={radios[21]} onClick={()=>handleRadioChange(21)}  type='radio' /> non-refundable <input id="rad" className="in-rad"  checked={radios[22]} onClick={()=>handleRadioChange(22)}  type='radio' /> refundable unless there are damages related to the pet. The Tenant is responsible for all damage that any pet causes, regardless of the ownership of said pet, and agrees to restore the Premises to its original condition at their expense.</p>
            <br></br>
            <p> 10. <b>PARKING. </b> The Landlord: (check one)</p>
            <br></br>
            <p className='indent'><input id="rad" className="in-rad"  checked={radios[23]} onClick={()=>handleRadioChange(23)}  type='radio' /> <b> Shall provide </b><input id="in35"  className="in-text" value={inputs[35]} onChange={(e) => handleInputChange(35, e.target.value)} type='text'/> parking space(s) to the Tenant for a fee of $<input id="in36"  className="in-text" value={inputs[36]} onChange={(e) => handleInputChange(36, e.target.value)} type='text'/> to be paid <input id="rad" className="in-rad"  checked={radios[24]} onClick={()=>handleRadioChange(24)}  type='radio' /> at the execution of this Agreement <input id="rad" className="in-rad"  checked={radios[25]} onClick={()=>handleRadioChange(25)}  type='radio' /> on a monthly basis in addition to the rent. The parking space(s) are described as: [DESCRIBE PARKING SPACES] <input id="in37"  className="in-text" value={inputs[37]} onChange={(e) => handleInputChange(37, e.target.value)} type='text'/>. </p>
            <br></br>
            <p className='indent'><input id="rad" className="in-rad"  checked={radios[26]} onClick={()=>handleRadioChange(26)}  type='radio' /> <b> Shall Not </b> provide parking.</p>  
            <br></br>
            <p> 11. <b> FEES. </b> The Landlord requires the Tenant pays the following fees at the execution of this Agreement: (check all that apply)</p>
            <br></br>
            <p className='indent'><input id="rad" className="in-rad"  checked={radios[27]} onClick={()=>handleRadioChange(27)}  type='radio' /><b> Cleaning Fee: </b>$<input id="in38"  className="in-text" value={inputs[38]} onChange={(e) => handleInputChange(38, e.target.value)} type='text'/> </p>
            <p className='indent'><input id="rad" className="in-rad"  checked={radios[28]} onClick={()=>handleRadioChange(28)}  type='radio' /><b> Taxes: </b>$<input id="in39"  className="in-text" value={inputs[39]} onChange={(e) => handleInputChange(39, e.target.value)} type='text'/> </p>
            <p className='indent'><input id="rad" className="in-rad"  checked={radios[29]} onClick={()=>handleRadioChange(29)}  type='radio' /><b> Other.</b><input id="in40"  className="in-text" value={inputs[40]} onChange={(e) => handleInputChange(40, e.target.value)} type='text'/> $ <input id="in41"  className="in-text" value={inputs[41]} onChange={(e) => handleInputChange(41, e.target.value)} type='text'/>. </p>
            <p className='indent'><input id="rad" className="in-rad"  checked={radios[30]} onClick={()=>handleRadioChange(30)}  type='radio' /><b> Other.</b><input id="in42"  className="in-text" value={inputs[42]} onChange={(e) => handleInputChange(42, e.target.value)} type='text'/> $ <input id="in43"  className="in-text" value={inputs[43]} onChange={(e) => handleInputChange(43, e.target.value)} type='text'/>. </p>
            <br></br>
            <p> 12. <b> PARTY CLEANUP.</b> If the Premises qualifies for a “deep clean” due to the amount of “wear and tear” from a party or large gathering, a fee of $ <input id="in44"  className="in-text" value={inputs[44]} onChange={(e) => handleInputChange(44, e.target.value)} type='text'/> (“Party Cleanup Fee”) shall be charged at the end of the Lease Term. The Party Cleanup Fee may be deducted from the Security Deposit.</p>
            <br></br>
            <p> 13. <b> SMOKING POLICY. </b>  Smoking on the Premises is: (check one) </p>
            <br></br>
            <p className='indent'><input id="rad" className="in-rad"  checked={radios[31]} onClick={()=>handleRadioChange(31)}  type='radio' /> <b> - Prohibited </b></p>
            <p className='indent'><input id="rad" className="in-rad"  checked={radios[32]} onClick={()=>handleRadioChange(32)}  type='radio' /> <b> - Prohibited </b>ONLY in the following areas: </p>
            <p className='indent'><input id="in45"  className="in-text" value={inputs[45]} onChange={(e) => handleInputChange(45, e.target.value)} type='text'/> .</p>
            <br></br>
            <p> 14. <b> PERSON OF CONTACT. </b> The Landlord: (check one) </p>
            <br></br>
            <p className='indent'><input id="rad" className="in-rad"  checked={radios[33]} onClick={()=>handleRadioChange(33)}  type='radio' /> <b> - Does </b> have a manager on the Premises that can be contacted for any maintenance or repair at:</p>
            <p className='indent'>Agent/Manager’s Name:  <input id="in46"  className="in-text" value={inputs[46]} onChange={(e) => handleInputChange(46, e.target.value)} type='text'/> .</p>
            <p className='indent'>Telephone:  <input id="in47"  className="in-text" value={inputs[47]} onChange={(e) => handleInputChange(47, e.target.value)} type='text'/> .</p>
            <p className='indent'>E-mail:  <input id="in48"  className="in-text" value={inputs[48]} onChange={(e) => handleInputChange(48, e.target.value)} type='text'/> .</p>
            <br></br>
            <p className='indent'><input id="rad" className="in-rad"  checked={radios[34]} onClick={()=>handleRadioChange(34)}  type='radio' /> <b> - Does not </b> have an agent/manager on the Premises, although the Landlord can be contacted for any emergency, maintenance, or repair at: </p>
            <p className='indent'>Landlord's Name:  <input id="in49"  className="in-text" value={inputs[49]} onChange={(e) => handleInputChange(49, e.target.value)} type='text'/> .</p>
            <p className='indent'>Telephone:  <input id="in50"  className="in-text" value={inputs[50]} onChange={(e) => handleInputChange(50, e.target.value)} type='text'/> .</p>
            <p className='indent'>E-mail:  <input id="in51"  className="in-text"  value={inputs[51]} onChange={(e) => handleInputChange(51, e.target.value)} type='text'/> .</p>
            <br></br>
            <p> 15. <b> SUBLETING. </b> The Tenant: (check one) </p>
            <p className='indent'><input id="rad" className="in-rad"  checked={radios[35]} onClick={()=>handleRadioChange(35)}  type='radio' /><b> - Has </b> the right to sublet the Premises. Each subtenant is: (check one) </p>
            <p className='indent'><input id="rad" className="in-rad"  checked={radios[36]} onClick={()=>handleRadioChange(36)}  type='radio' />  required to be approved by the Landlord prior to occupancy. </p>
            <p className='indent'><input id="rad" className="in-rad"  checked={radios[37]} onClick={()=>handleRadioChange(37)}  type='radio' />  not required to be approved by the Landlord.  </p>
            <p className='indent'><input id="rad" className="in-rad"  checked={radios[38]} onClick={()=>handleRadioChange(38)}  type='radio' /><b> - Does not </b> have the right to sublet the Premises.</p>
            <br></br>
            <p> 16. <b> MOVE-IN INSPECTION. </b> Before, at the time of the Tenant accepting possession, or shortly thereafter, the Landlord and Tenant shall: (check one) </p>
            <p className='indent'><input id="rad" className="in-rad"  checked={radios[39]} onClick={()=>handleRadioChange(39)}  type='radio' /><b> - Inspect </b> the Premises and write any present damages or needed repairs on a move-in checklist.</p>
            <p className='indent'><input id="rad" className="in-rad"  checked={radios[40]} onClick={()=>handleRadioChange(40)}  type='radio' /><b> - Shall not </b>  inspect the Premises or complete a move-in checklist </p>
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

            {/* <p> <b> Landlord Signature:</b> <input id="in52"  className="in-text" value={inputs[52]} onChange={(e) => handleInputChange(52, e.target.value)} type='text'/> Date: <input id="in53"  className="in-text" value={inputs[53]} onChange={(e) => handleInputChange(53, e.target.value)} type='text'/></p>
            <p> Print Name: <input id="in54"  className="in-text" value={inputs[54]}onChange={(e) => handleInputChange(54, e.target.value)} type='text'/></p>
            <br></br>
            <p> <b> Tenant Signature:</b> <input id="in55"  className="in-text" value={inputs[55]} onChange={(e) => handleInputChange(55, e.target.value)} type='text'/> Date: <input id="in56"  className="in-text" value={inputs[56]} onChange={(e) => handleInputChange(56, e.target.value)} type='text'/></p>
            <p> Print Name: <input id="in57"  className="in-text" value={inputs[57]} onChange={(e) => handleInputChange(57, e.target.value)} type='text'/></p>
            <br></br>
            <p> <b> Tenant Signature:</b> <input id="in58"  className="in-text" value={inputs[58]} onChange={(e) => handleInputChange(58, e.target.value)} type='text'/> Date: <input id="in59"  className="in-text" value={inputs[59]} onChange={(e) => handleInputChange(59, e.target.value)} type='text'/></p>
            <p> Print Name: <input id="in60"  className="in-text" value={inputs[60]} onChange={(e) => handleInputChange(60, e.target.value)} type='text'/></p> */}



        <div className='grid-tenant-signs'>
          <div>
            <div className='sign'>  
                <img src={currentTenantSign1} />
                <p> {nameTenant1} </p>
            </div>
          </div>
          <div>
            <div className='sign'>  
                <img src={currentTenantSign2} />
                <p> {nameTenant2} </p>
            </div>
          </div>
        </div>

         <div className='sign'>  
            <img src={currentLandlordSign} />
            <p> {nameLandlord} </p>
         </div>
           
        </div>

        <div className='floatingBtns'>
            <button id="sign" onClick={()=> openSigner(1)}> <i className="bi bi-pencil-square"></i> {isMobile ? "Tenant 1" : "Sign - Tenant 1"} </button>
            <button id="sign" onClick={()=> openSigner(2)}> <i className="bi bi-pencil-square"></i> {isMobile ? "Tenant 2" : "Sign - Tenant 2"} </button>
            <button id="sign" onClick={()=> openSigner(3)} style={{display: adminAccess? "block":"none"}}> <i className="bi bi-pencil-square"></i> {isMobile ? "Landlord" : "Sign - Landlord"} </button>
            <button id="save" onClick={()=> handleSave()}> Save <i className="bi bi-chevron-right"></i> </button>
        </div>

        <div className='overlay'  style={{display: showOverlay? "block":"none"}} onClick={()=>closeSigners()}></div>
        <div className='sign-pad' style={{display: showPopup1? "block":"none"}}>
            <div className='pad'>
            <SignatureCanvas 
                canvasProps={{width: 720, height: 300, className: 'sigCanvas'}} 
                ref={signTenant1=>setSignTenant1(signTenant1)}
            ></SignatureCanvas>
            </div>
            <input type='text' placeholder='Full Name - Tenant 1' onChange={(e)=>setNameTenant1(e.target.value)}></input>
            <div className='actions'>
                <button  onClick={()=>storeSign(1)}id="save"> Save </button>
                <button id="cancel" onClick={()=>clearSign(1)}> Clear </button>
            </div>
        </div>
        <div className='sign-pad' style={{display: showPopup2? "block":"none"}}>
            <div className='pad'>
            <SignatureCanvas 
                canvasProps={{width: 720, height: 300, className: 'sigCanvas'}} 
                ref={b=>setSignTenant2(b)}
            ></SignatureCanvas>
            </div>
            <input type='text' placeholder='Full Name - Tenant 2' onChange={(e)=>setNameTenant2(e.target.value)}></input>
            <div className='actions'>
                <button  onClick={()=>storeSign(2)}id="save"> Save </button>
                <button id="cancel" onClick={()=>clearSign(2)}> Clear </button>
            </div>
        </div>
        <div className='sign-pad' style={{display: showPopup3? "block":"none"}}>
            <div className='pad'>
            <SignatureCanvas 
                canvasProps={{width: 720, height: 300, className: 'sigCanvas'}} 
                ref={c=>setSignLandlord(c)}
            ></SignatureCanvas>
            </div>
            <input type='text' placeholder='Full Name - Landlord' onChange={(e)=>setNameLandlord(e.target.value)}></input>
            <div className='actions'>
                <button onClick={()=>storeSign(3)}id="save"> Save </button>
                <button id="cancel" onClick={()=>clearSign(3)}> Clear </button>
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