import React, { useState } from 'react';
import styles from '../../../configuration/CSS/Index.module.css';

interface Option {
  label: string;
  value: string;
}

interface SelectInputProps {
  options: Option[];
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectInputField: React.FC<SelectInputProps> = ({ options, onChange }) => {
  const [selectedValue, setSelectedValue] = useState<string>(''); // Initialize with an empty string

  const changeSelectedValue = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(event.target.value); // Set the selected value to the value of the selected option
  };

  return (
    <div className={styles.select_container}>
      <select
        className={styles.select_input}
        value={selectedValue}
        onChange={(event) => {
          changeSelectedValue(event); // Pass the event to changeSelectedValue
          onChange(event); // Call the onChange function with the event
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
