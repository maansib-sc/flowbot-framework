import React, { useContext } from 'react';
import ThemeContext from '@/contexts/ThemeContext';

interface Option {
  label: string;
  value: string;
}

interface SelectInputProps {
  options: Option[];
  value: string;
  label: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectInput: React.FC<SelectInputProps> = ({
  options,
  value,
  onChange,
  label,
}) => {
  const { styles } = useContext(ThemeContext);
  return (
    <div className={styles.select_container}>
      <span>{label}</span>
      <select className={styles.select_input} value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
