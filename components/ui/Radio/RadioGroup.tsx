import React, { useState } from 'react';
import styles from '@/configuration/CSS/Index.module.css';

const RadioGroup = ({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}) => {

  const [selectedValue, setSelectedValue] = useState<string | null>(value || null)

  const changeSelectedValue = (value: string) => {
    setSelectedValue(value)
    onChange(value)
  }
  return (
    <div className={styles.radioGroup}> {/* Apply a class from the imported CSS module */}
      {options.map((option, index) => (
        <label
          key={option.value}
          className={`${styles.radioLabel} ${selectedValue === option.value ? styles.selected : ''}`}
        >
          {option.label}
          <input
            type="radio"
            value={option.value}
            checked={selectedValue === option.value}
            onChange={() => {
              changeSelectedValue(option.value)
            }}
            className={styles.radioInput}
          />
        </label>
      ))}
    </div>
  );
};

export default RadioGroup;
