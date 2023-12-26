import { useState } from "react";
import TextInput from "../Input/TextInput";
import Button from "../Buttons/Button";
import styles from "./ReferralCard.module.css"


function ReferralCard({
    disabled,
    onClose,
  }: {
    disabled: boolean;
    onClose: (value: string) => void;
  }) {
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [name, setName] = useState("")
    const [emailError, setEmailError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [showButton, setShowButton] = useState(true);

    function validateEmail(value: string) {
        // Regular expression for a simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        if (!value || typeof value !== 'string') {
          return "Please enter a valid email address.";
        }
    
        if (!emailRegex.test(value)) {
          return "Please enter a valid email address format.";
        }
        return ""
    }

    function validateNumber(input: number) {
        input = Number(input)
        const isNumeric = /^\d+$/;

        if (!input || typeof input !== 'number') {
            return "Please enter a valid number.";
        }

        const inputString = input.toString();

        if (inputString.length === 10 && isNumeric.test(inputString)) {
            return ""; // Indicates no validation errors
        }

        return "Number must be exactly 10 digits long.";
    }

    return (
        <>
        <div className={styles.container}>
            <div style={{ display: "flex", flexDirection: "column" }}>
            <TextInput disabled={disabled} label='Referral Name' value={name} onChange={(e) => { setName(e.target.value)}} />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
            <TextInput disabled={disabled} label='Phone Number' value={phone} onChange={(e) => { setPhone(e.target.value); setPhoneError(validateNumber(e.target.value))}} />
            {phoneError && <p style={{ color: "red", width: "200px" }}>{phoneError}</p>}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
            <TextInput disabled={disabled} label='Email Address' value={email} onChange={(e) => { setEmail(e.target.value); setEmailError(validateEmail(e.target.value)) }} />
            {emailError && <p style={{ color: "red", width: "200px" }}>{emailError}</p>}
            </div>
        </div>
        {showButton && <div className='mt-6'> 
            <Button onClick={() => {
                onClose(JSON.stringify({"email": email, "phone": phone, "name": name})); 
                setShowButton(false)
            }}>Submit</Button>
        </div> }
        </>
    )
}

export default ReferralCard