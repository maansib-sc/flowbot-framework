import React from 'react';
import styles from '@/configuration/CSS/Index.module.css';

const RadioGroup = ({
  options,
  selectedValue,
  onChange,
}: {
  options: { label: string; value: string }[];
  selectedValue: string;
  onChange: (value: string) => void;
}) => {
  return (
    <div className={styles.radioGroup}> {/* Apply a class from the imported CSS module */}
      {options.map((option) => (
        <label
          key={option.value}
          className={`${styles.radioLabel} ${selectedValue === option.value ? styles.selected : ''}`}
        >
          {option.label}
          <input
            type="radio"
            value={option.value}
            checked={selectedValue === option.value}
            onChange={() => onChange(option.value)}
            className={styles.radioInput}
          />
        </label>
      ))}
    </div>
  );
};

export default RadioGroup;
