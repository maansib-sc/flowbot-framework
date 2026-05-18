import React, { useState, useContext } from 'react';
import ThemeContext from '@/contexts/ThemeContext';
import RadioGroup from '../Radio/RadioGroup';

const SearchRadioGroup = ({
  options,
  value,
  disabled,
  onChange,
}: {
  options: { label: string; value: string; data?: any }[];
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) => {
  const { styles } = useContext(ThemeContext);
  const [selectedValue, setSelectedValue] = useState<{
    label: string;
    value: string;
    data?: any;
  } | null>(null);
  const [searchList, setSearchList] = useState<any>([])
  const [height, setHeight] = useState('200px')

  const changeSelectedValue = (value: {
    label: string;
    value: string;
    data?: any;
  }) => {
    setSelectedValue(value);
    onChange(JSON.stringify(value));
  };

  const inputStyle = {
    width: "100%" // Use the provided width or default to 100%
  };
  const containerStyle = {
    width: '85%', // Use the provided width or default to 100%
    display: 'flex',
  };

  const onvalueChange = (e: any) => {
    let val = options.filter(item =>
      item.label.toLowerCase().includes(e.target.value)
    )
    if (!e.target.value) { 
      setSearchList([])
      setHeight('200px')
    } else {
      setSearchList(val)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className={styles.input_container} style={{ width: '100%', display: 'flex', marginBottom: "18px" }}>
        <div className={styles.input_container} style={containerStyle}>
          <input
            style={inputStyle}
            placeholder='search for the project'
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
      <div style={{display: 'flex', height: searchList?.length === 0 ? height : 'auto', overflow: 'hidden'}}>
        <div style={{width: '100%'}}>
          <RadioGroup
            options={searchList?.length > 0 ? searchList : options}
            value={value}
            disabled={disabled}
            onChange={(value) => {
              onChange(value)
            }}
          />
        </div>
      </div>
      {height === '200px' && searchList.length === 0 && 
      <div className='mt-4' style={{display: 'flex', alignItems: 'center'}}>
        <span className='mr-2' style={{ color: "#FF6900", cursor: 'pointer' }} onClick={() => setHeight('auto')}>View More</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5898 13.0894C10.2643 13.4148 9.73667 13.4148 9.41126 13.0894L4.69721 8.37531C4.37176 8.04991 4.37176 7.52228 4.69721 7.19683C5.02264 6.8714 5.55028 6.8714 5.87571 7.19683L10.0005 11.3216L14.1253 7.19683C14.4508 6.8714 14.9783 6.8714 15.3038 7.19683C15.6293 7.52228 15.6293 8.04991 15.3038 8.37531L10.5898 13.0894Z" fill="#FF6900"/>
        </svg>
      </div>
      }
    </div>
  );
};

export default SearchRadioGroup;
