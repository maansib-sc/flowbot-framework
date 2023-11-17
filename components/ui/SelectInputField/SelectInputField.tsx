import React, { useState } from 'react';
import styles from '../../../configuration/CSS/Index.module.css';

interface Option {
  label: string;
  value: string;
}

interface SelectInputProps {
  options: Option[];
  onChange: (value: string) => void;
  value: string;
}

const SelectInputField: React.FC<SelectInputProps> = ({ options, onChange, value }) => {
  const [selectedValue, setSelectedValue] = useState<string>(value); // Initialize with an empty string

  const changeSelectedValue = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = String(event.target.value) || ""
    setSelectedValue(value); // Set the selected value to the value of the selected option
    onChange(value)
  };

  return (
    <div className={styles.select_container}>
      <select
        className={styles.select_input}
        value={value}
        onChange={(event) => {
          changeSelectedValue(event);
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInputField;
