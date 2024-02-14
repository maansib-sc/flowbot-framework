import React, { useState, useContext } from 'react';
import ThemeContext from '@/contexts/ThemeContext';

const RadioGroup = ({
  options,
  value,
  disabled,
  onChange,

}: {
  options: { label: string; value: string; data?: any }[];
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) => {
  const { styles } = useContext(ThemeContext);
  const [selectedValue, setSelectedValue] = useState<{
    label: string;
    value: string;
    data?: any;
  } | null>(null);

  const changeSelectedValue = (value: {
    label: string;
    value: string;
    data?: any;
  }) => {
    setSelectedValue(value);
    onChange(JSON.stringify(value));
  };



  return (
    <div className={styles.radioGroup}>
      {' '}
      {/* Apply a class from the imported CSS module */}
      {options.map((option, index) => (
        <label
          key={option.value}
          className={`${styles.radioLabel} ${selectedValue?.value === option.value ? styles.selected : ''
            }`}
        >
          <span className={`${styles.radioText}`} style={{ width: '180px' }} >{option.label}</span>
          <input
            type="radio"
            value={option.value}
            disabled={disabled}
            checked={selectedValue?.value === option.value}
            onChange={() => {
              changeSelectedValue(option);
            }}
            className={styles.radioInput}
          />
        </label>
      ))}
    </div>
  );
};

export default RadioGroup;
