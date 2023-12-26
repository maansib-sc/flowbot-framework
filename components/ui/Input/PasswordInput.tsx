import React, { useState, useContext } from 'react';
import Eye from '@/assets/svgs/Eye';
import ThemeContext from '@/contexts/ThemeContext';

const PasswordInput = ({
  disabled,
  value,
  onChange,
}: {
  disabled: boolean;
  value: string;
  onChange: (e: any) => void;
}) => {
  const { styles } = useContext(ThemeContext);
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
        <input
          type={inputType}
          className={styles.password_input}
          disabled={disabled}
          value={value}
          onChange={onChange}
        />
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
