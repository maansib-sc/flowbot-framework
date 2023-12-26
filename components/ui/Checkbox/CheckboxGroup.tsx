import React, { useState, useContext } from 'react';
import Button from '../Buttons/Button';
import ThemeContext from '@/contexts/ThemeContext';

interface Item {
  label: string;
  value: string;
}

const CheckboxGroup = ({
  options,
  values,
  onChange,
}: {
  options: { label: string; value: string }[];
  values: string;
  onChange: (value: string) => void;
}) => {
  const { styles } = useContext(ThemeContext);
  const [selectedValues, setSelectedValue] = useState<Item[]>([]);
  const [showButton, setShowButton] = useState(true);
  const handleCheckboxChange = (option: Item) => {
    if (
      selectedValues.some(
        (selectedOption) => selectedOption.value === option.value,
      )
    ) {
      setSelectedValue(
        selectedValues.filter((item) => item.value !== option.value),
      );
    } else {
      setSelectedValue([...selectedValues, option]);
    }
  };

  return (
    <>
      <div className={styles.checkboxGroup}>
        {options.map((option) => (
          <label
            key={option.value}
            className={`${styles.checkboxLabel} ${
              selectedValues.some(
                (selectedOption) => selectedOption.value === option.value,
              )
                ? styles.selected
                : ''
            }`}
          >
            <span style={{ width: '200px' }}>{option.label}</span>
            <input
              type="checkbox"
              value={option.value}
              checked={selectedValues.some(
                (selectedOption) => selectedOption.value === option.value,
              )}
              onChange={() => handleCheckboxChange(option)}
              className={styles.checkboxInput}
            />
          </label>
        ))}
      </div>
      {showButton && (
        <div>
          <Button
            onClick={() => {
              onChange(JSON.stringify(selectedValues));
              setShowButton(false);
            }}
          >
            Confirm
          </Button>
        </div>
      )}
    </>
  );
};

export default CheckboxGroup;
