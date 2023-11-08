import React, { useState } from 'react';
import styles from '../../../configuration/CSS/Index.module.css';
import Eye from '@/assets/svgs/Eye';

const PasswordInput = ({ disabled, value }: { disabled: boolean, value: string }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [inputType, setInputType] = useState('password');

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
    setInputType(!passwordVisible ? 'password' : 'text');
  };

  return (
    <div className={styles.input_container}>
      <span>Password</span>
      <div className={styles.input_container}>
        <input type={inputType} className={styles.password_input} disabled={disabled} value={value} />
        <button
          onClick={togglePasswordVisibility}
          className={styles.show_hide_button}
        >
          {passwordVisible ? <Eye /> : <Eye />}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
