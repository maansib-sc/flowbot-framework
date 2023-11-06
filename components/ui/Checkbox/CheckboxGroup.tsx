import React from 'react';
import styles from '@/configuration/CSS/Index.module.css';

const CheckboxGroup = ({
  options,
  selectedValues,
  onChange,
}: {
  options: { label: string; value: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}) => {
  const handleCheckboxChange = (value: string) => {
    if (selectedValues.includes(value)) {
      // If the value is already selected, remove it
      onChange(selectedValues.filter((val) => val !== value));
    } else {
      // If the value is not selected, add it
      onChange([...selectedValues, value]);
    }
  };

  return (
    <div className={styles.checkboxGroup}>
      {options.map((option) => (
        <label key={option.value}
        
        className={`${styles.checkboxLabel} ${selectedValues.includes(option.value) ? styles.selected : ''}`}
         >
          {option.label}
          <input
            type="checkbox"
            value={option.value}
            checked={selectedValues.includes(option.value)}
            onChange={() => handleCheckboxChange(option.value)}
            className={styles.checkboxInput}
          />
        </label>
      ))}
    </div>
  );
};

export default CheckboxGroup;
