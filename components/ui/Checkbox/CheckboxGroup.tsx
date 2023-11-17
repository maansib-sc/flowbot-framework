import React, { useState } from 'react';
import styles from '@/configuration/CSS/Index.module.css';
import Button from '../Buttons/Button';

const CheckboxGroup = ({
  options,
  values,
  onChange,
}: {
  options: { label: string; value: string }[];
  values: string;
  onChange: (value: string) => void;
}) => {

  const [selectedValues, setSelectedValue] = useState<string[]>([])
  const [showButton, setShowButton] = useState(true)
  const handleCheckboxChange = (value: string) => {
    if (selectedValues.includes(value)) {
      // If the value is already selected, remove it
      setSelectedValue(selectedValues.filter((val) => val !== value));
    } else {
      // If the value is not selected, add it
      setSelectedValue([...selectedValues, value]);
    }
  };

  return (
    <>
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
      {showButton && <div>
        <Button onClick={() => { onChange(selectedValues.join('@')); setShowButton(false) }}>Confirm</Button>
      </div >}
    </>
  );
};

export default CheckboxGroup;
