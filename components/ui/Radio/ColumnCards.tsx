import React, { useState } from 'react';
import styles from '@/configuration/CSS/Index.module.css';

const ColumnCards = ({
  options,
  onChange,
}: {
  options: { label: string; value: string,header?:string;}[];
  onChange: () => void;
}) => {

  const [selectedValue, setSelectedValue] = useState(0)

  const changeSelectedValue = (index: number) => {
    setSelectedValue(index)
  }
  return (
    <div className={styles.colCardsGroup}> {/* Apply a class from the imported CSS module */}
      {options.map((option,index) => (
        <label
          key={option.value}
          className={`${styles.colCardsLabel} ${selectedValue === index ? styles.selected : ''}`}
        >
          <input
            type="radio"
            value={option.value}
            checked={selectedValue === index}
            onChange={() => {
              onChange();
              changeSelectedValue(index)
            }}            className={styles.colCardsInput}
          />
          <div className={styles.colCardsiconcontainer}>
            <h3 className={styles.colCardsHeader}>
            {option?.header}
            </h3>
            <span>
            {option.label}
            </span>
          </div>
        </label>
      ))}
    </div>
  );
};

export default ColumnCards;
