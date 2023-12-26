import React, { useState, ChangeEvent, useContext } from 'react';
import Eye from '@/assets/svgs/Eye';
import Button from '../Buttons/Button';
import ThemeContext from '@/contexts/ThemeContext';

interface TextInputProps {
  width?: string; // Optional width prop
  containerwidth?: string;
  disabled?: boolean;
  onChange: (e: any) => void;
}

const SearchInput: React.FC<TextInputProps> = ({
  width,
  disabled,
  containerwidth,
  onChange,
}) => {
  const { styles } = useContext(ThemeContext);
  const inputStyle = {
    width: width, // Use the provided width or default to 100%
  };
  const containerStyle = {
    width: containerwidth || 'auto', // Use the provided width or default to 100%
    display: 'flex',
  };
  const [showButton, setShowButton] = useState<Boolean>(true);
  const [value, setValue] = useState('');

  const onvalueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <>
      <div className={styles.input_container} style={containerStyle}>
        <div className={styles.input_container} style={containerStyle}>
          <input
            style={inputStyle}
            className={styles.password_input}
            value={value}
            onChange={onvalueChange}
            disabled={disabled}
          />
          <div style={{ position: 'absolute', padding: '20px', right: '0px' }}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_3509_49302)">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M8.7513 1.66669C4.83929 1.66669 1.66797 4.838 1.66797 8.75002C1.66797 12.662 4.83929 15.8334 8.7513 15.8334C10.4071 15.8334 11.9301 15.2653 13.1362 14.3134L16.1798 17.3569C16.5052 17.6824 17.0329 17.6824 17.3583 17.3569C17.6837 17.0315 17.6837 16.5039 17.3583 16.1784L14.3147 13.1349C15.2666 11.9288 15.8346 10.4057 15.8346 8.75002C15.8346 4.838 12.6633 1.66669 8.7513 1.66669ZM3.33464 8.75002C3.33464 5.75848 5.75976 3.33335 8.7513 3.33335C11.7429 3.33335 14.168 5.75848 14.168 8.75002C14.168 11.7416 11.7429 14.1667 8.7513 14.1667C5.75976 14.1667 3.33464 11.7416 3.33464 8.75002Z"
                  fill="#AAB1BA"
                />
              </g>
              <defs>
                <clipPath id="clip0_3509_49302">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
      </div>
      {showButton && (
        <div className="pt-4">
          <Button
            onClick={() => {
              onChange(value);
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

export default SearchInput;
