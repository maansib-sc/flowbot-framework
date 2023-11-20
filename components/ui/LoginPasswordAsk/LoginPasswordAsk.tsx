import React, { useState } from 'react'
import TextInput from '../Input/TextInput'
import PasswordInput from '../Input/PasswordInput'
import styles from "./LoginPasswordAsk.module.css"
import Button from '../Buttons/Button'

const LoginPasswordAsk = ({
  onSave,
}: {
  options: { label: string; value: string,header?:string;}[];
  onSave: () => void;
}) => {
    const [pass,setPass] = useState("")
    
  return (
    <div className={styles.LoginPasswordAsk}>
        <div className={styles.container}>
        <TextInput label='Login' />
        <PasswordInput disabled={false} value={pass}/>
        </div>
        <div className={styles.forgot}>
        <Button variant='link'>Forgot Password?</Button>
        </div>
        <Button onClick={onSave}>Login</Button>
    </div>
  )
}

export default LoginPasswordAsk