import React, { useState } from 'react';
import { MultiSelect } from 'react-multi-select-component';
import Button from '../Buttons/Button';

interface Option {
  label: string;
  value: string;
}

interface SelectInputProps {
  options: Option[];
  onChange: (value: string) => void;
  value: string;
}

const MultiSelectInput: React.FC<SelectInputProps> = ({
  options,
  onChange,
  value,
}) => {
  const [selectedValue, setSelectedValue] = useState([]); // Initialize with an empty string
  const [showButton, setShowButton] = useState<Boolean>(true);

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '260px' }}>
        <MultiSelect
          options={options}
          value={selectedValue}
          onChange={setSelectedValue}
          labelledBy={value}
        />
      </div>
      <div style={{ marginLeft: '20px' }}>
        {showButton && (
          <Button
            onClick={() => {
              onChange(JSON.stringify(selectedValue));
              setShowButton(false);
            }}
          >
            Confirm
          </Button>
        )}
      </div>
    </div>
  );
};

export default MultiSelectInput;
