import React, { useContext } from 'react';
import ThemeContext from '@/contexts/ThemeContext';

interface TextInputProps {
  label: string; // Prop for the input label
  value: string;
  width?: string; // Optional width prop
  containerwidth?: string;
  disabled?: boolean;
  onChange: (e: any) => void;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  width,
  disabled,
  containerwidth,
  onChange,
}) => {
  const { styles } = useContext(ThemeContext);
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
        <input
          style={inputStyle}
          className={styles.password_input}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default TextInput;
