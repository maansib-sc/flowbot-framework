import React, { useEffect, useState, useContext } from 'react';
// import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import Button from '../Buttons/Button';
import ThemeContext from '@/contexts/ThemeContext';

interface Option {
  label: string;
  value: string;
}

interface Item {
  id: string;
  name: string;
}

interface SelectInputProps {
  options: Option[];
  onChange: (value: string) => void;
  value: string;
  disabled: boolean;
}

const AutoCompleteInput: React.FC<SelectInputProps> = ({
  options,
  onChange,
  value,
  disabled,
}) => {
  const { styles } = useContext(ThemeContext);
  const [selectedValue, setSelectedValue] = useState(''); // Initialize with an empty string
  const [showButton, setShowButton] = useState<Boolean>(true);
  const [items, setItems] = useState<Item[]>([]);
  const [searchString, setSearchString] = useState('');
  const [highlightedItem, setHighlightedItem] = useState(-1);

  const autoCompleteAPI = async (value: string) => {
    try {
      let res = await fetch(`/api/places?input=${value}`, {
        method: 'GET',
      });
      let response = await res.json();
      setItems(
        response?.msg?.predictions?.map((item: any) => ({
          id: item.place_id,
          name: item.description,
        })),
      );
    } catch (error) {
      console.log('error from autocomplete ==>', error);
    }
  };

  const handleSearchString = (e: any) => {
    setSearchString(e.target.value);
    setSelectedValue(e.target.value);
  };

  useEffect(() => {
    if (searchString.length > 2) {
      autoCompleteAPI(searchString);
    }
  }, [searchString]);

  const handleSelectedItem = (event: any, index = undefined) => {
    let itemIndex = -1;
    if (index !== undefined) {
      setHighlightedItem(index);
      setSearchString('');
      setItems([]);
    } else if (event) {
      switch (event.key) {
        case 'Enter':
          if (items.length > 0 && items[highlightedItem]) {
            event.preventDefault();
            setSelectedValue(items[highlightedItem]?.name);
            setSearchString('');
            setItems([]);
          }
          setHighlightedItem(-1);
          break;
        case 'ArrowUp':
          event.preventDefault();
          itemIndex =
            highlightedItem > -1 ? highlightedItem - 1 : items.length - 1;
          setHighlightedItem(itemIndex);
          break;
        case 'ArrowDown':
          event.preventDefault();
          itemIndex =
            highlightedItem < items.length - 1 ? highlightedItem + 1 : -1;
          setHighlightedItem(itemIndex);
          break;
        default:
          break;
      }
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ width: '380px' }}>
        <div className={styles.input_container}>
          <div style={{ position: 'relative', width: '380px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                position: 'absolute',
                height: '100%',
                marginLeft: '10px',
              }}
            >
              <svg
                width="20"
                height="20"
                focusable="false"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
              </svg>
            </div>
            <input
              className={styles.password_input}
              value={selectedValue}
              style={{ width: '380px', padding: '12px 34px' }}
              onChange={(e) => handleSearchString(e)}
              onKeyDown={(event) => handleSelectedItem(event)}
              disabled={disabled}
            />
            <div
              style={{
                position: 'absolute',
                width: '100%',
                border: searchString ? '1px solid #ccc' : 'none',
              }}
            >
              {searchString &&
                items?.map((val, index) => {
                  return (
                    <div
                      key={index}
                      style={{
                        padding: '4px 10px 4px 10px',
                        cursor: 'pointer',
                        background: highlightedItem === index ? '#fbf0e8' : '',
                      }}
                      onClick={() => {
                        setSearchString('');
                        setSelectedValue(val?.name);
                        setHighlightedItem(index);
                      }}
                    >
                      {val?.name}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginLeft: '20px' }}>
        {showButton && (
          <Button
            onClick={() => {
              onChange(selectedValue);
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

export default AutoCompleteInput;
