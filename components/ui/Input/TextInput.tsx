import React, { useState } from 'react';
import styles from '../../../configuration/CSS/Index.module.css';
import Eye from '@/assets/svgs/Eye';

interface TextInputProps {
  label: string; // Prop for the input label
  width?: string; // Optional width prop
  containerwidth?:string;
}

const TextInput: React.FC<TextInputProps> = ({ label, width,containerwidth }) => {
  const inputStyle = {
    width: width, // Use the provided width or default to 100%
  };
  const containerStyle = {
    width: containerwidth || 'auto', // Use the provided width or default to 100%
  };


  return (
    <div className={styles.input_container} style={containerStyle}>
      <span>{label}</span>
      <div className={styles.input_container} style={containerStyle}>
        <input style={inputStyle} className={styles.password_input} />
      </div>
    </div>
  );
};

export default TextInput;
