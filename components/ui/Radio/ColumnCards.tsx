import React, { useState, useContext } from 'react';
import ThemeContext from '@/contexts/ThemeContext';

const ColumnCards = ({
  options,
  onChange,
  disabled,
}: {
  options: { label: string; value: string; header?: string }[];
  onChange: (value: string) => void;
  disabled: boolean;
}) => {
  const { styles } = useContext(ThemeContext);
  const [selectedValue, setSelectedValue] = useState(-1);

  const changeSelectedValue = (index: number) => {
    setSelectedValue(index);
  };
  return (
    <div className={styles.colCardsGroup}>
      {' '}
      {/* Apply a class from the imported CSS module */}
      {options.map((option, index) => (
        <label
          key={option.value}
          className={`${styles.colCardsLabel} ${
            selectedValue === index ? styles.selected : ''
          }`}
        >
          <input
            type="radio"
            disabled={disabled}
            value={option.value}
            checked={selectedValue === index}
            onChange={() => {
              onChange(JSON.stringify(option));
              changeSelectedValue(index);
            }}
            className={styles.colCardsInput}
          />
          <div className={styles.colCardsiconcontainer}>
            <h3 className={styles.colCardsHeader}>{option?.header}</h3>
            <span>{option.label}</span>
          </div>
        </label>
      ))}
    </div>
  );
};

export default ColumnCards;
