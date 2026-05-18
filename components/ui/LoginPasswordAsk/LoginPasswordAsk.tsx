import React, { useState } from 'react'
import TextInput from '../Input/TextInput'
import PasswordInput from '../Input/PasswordInput'
import styles from "./LoginPasswordAsk.module.css"
import Button from '../Buttons/Button'

const LoginPasswordAsk = ({
  options,
  disabled,
  onSave,
}: {
  options: any,
  disabled: boolean;
  onSave: (value: string) => void;
}) => {
  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showButton, setShowButton] = useState(true)


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

  function validatePassword(input: string) {
    // Minimum 6 characters
    if (input.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    // Should have one letter, one number, one special symbol
    const hasLetter = /[A-Z]/.test(input);
    const hasNumber = /\d/.test(input);
    const hasSymbol = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(input);
    if (!(hasLetter && hasNumber && hasSymbol)) {
      return "Password must contain at least one letter, one number, and one special symbol.";
    }
    return ''; // Indicates no validation errors
  }

  return (
    <div className={styles.LoginPasswordAsk}>
      <div className={styles.container}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <TextInput disabled={disabled} label='Email' value={email} onChange={(e) => { setEmail(e.target.value); setEmailError(validateEmail(e.target.value)) }} />
          {emailError && <p style={{ color: "red", width: "200px" }}>{emailError}</p>}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <PasswordInput disabled={disabled} value={pass} onChange={(e) => { setPass(e.target.value); setPasswordError(validatePassword(e.target.value)) }} />
          {passwordError && <p style={{ color: "red", width: "200px" }}>{passwordError}</p>}
        </div>
      </div>
      <div className={styles.forgot}>
        <Button variant='link' onClick={() => onSave("forgotPassword")}>Forgot Password?</Button>
      </div>

      {showButton && <div>
        <Button onClick={() => { onSave(JSON.stringify({ "email": email, "password": pass })); setShowButton(false) }} disabled={!email || !pass || emailError || passwordError ? true : false} variant={!email || !pass || emailError || passwordError ? 'ghost' : 'primary'}>Login</Button>
      </div>}
    </div>
  )
}

export default LoginPasswordAsk