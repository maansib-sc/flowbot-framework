import React, { useState } from 'react';
import styles from '@/configuration/CSS/Index.module.css';

const RadioGroup = ({
  options,
  onChange,
}: {
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}) => {

  const [selectedValue, setSelectedValue] = useState(0)

  const changeSelectedValue = (index: number) => {
    setSelectedValue(index)
    onChange(options[index].value)
  }
  return (
    <div className={styles.radioGroup}> {/* Apply a class from the imported CSS module */}
      {options.map((option, index) => (
        <label
          key={option.value}
          className={`${styles.radioLabel} ${selectedValue === index ? styles.selected : ''}`}
        >
          {option.label}
          <input
            type="radio"
            value={option.value}
            checked={selectedValue === index}
            onChange={() => {
              changeSelectedValue(index)
            }}
            className={styles.radioInput}
          />
        </label>
      ))}
    </div>
  );
};

export default RadioGroup;
