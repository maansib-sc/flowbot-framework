import React from 'react';
import styles from '@/configuration/CSS/Index.module.css';

const CardRadioGroup = ({
  options,
  selectedValue,
  onChange,
}: {
  options: { label: string; value: string,icon?: React.FC;}[];
  selectedValue: string;
  onChange: (value: string) => void;
}) => {
  return (
    <div className={styles.cardradioGroup}> {/* Apply a class from the imported CSS module */}
      {options.map((option) => (
        <label
          key={option.value}
          className={`${styles.cardradioLabel} ${selectedValue === option.value ? styles.selected : ''}`}
        >
          <div className={styles.cardradioiconcontainer}>
            {option?.icon && <option.icon />}
            <span>
            {option.label}
            </span>
          </div>
          <input
            type="radio"
            value={option.value}
            checked={selectedValue === option.value}
            onChange={() => onChange(option.value)}
            className={styles.cardradioInput}
          />
        </label>
      ))}
    </div>
  );
};

export default CardRadioGroup;
