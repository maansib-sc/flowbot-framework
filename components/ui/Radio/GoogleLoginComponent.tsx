import React, { useState } from 'react';
import styles from '@/configuration/CSS/Index.module.css';
import GoogleSSO from '../GoogleSSO';

const GoogleLoginComponent = ({
  handleSubmit,
  options,
  // onChange,
}: {
  options: { label: string; value: string }[];
  // onChange: (value: string) => void;
  handleSubmit: (val?:string)=>void;
}) => {

  const [selectedValue, setSelectedValue] = useState(0)

  const changeSelectedValue = (index: number) => {
    if(index == 1){
      setSelectedValue(index)
    }else{
      setSelectedValue(index)
      handleSubmit("no")
      // onChange("no")
    }
  }

  console.log(selectedValue)
  return (
    <div className={styles.radioGroup}> {/* Apply a class from the imported CSS module */}
      {/* {options.map((option, index) => ( */}
        <label
          key={"yes"}
          className={`${styles.radioLabel} ${selectedValue === 1 ? styles.selected : ''}`}
        >
          {"Yes"}
          <input
            type="radio"
            value={"yes"}
            checked={selectedValue === 1}
            onChange={() => {
              changeSelectedValue(1)
            }}
            className={styles.radioInput}
          />
        </label>
        {selectedValue == 1 && 
        <GoogleSSO handleSubmit={handleSubmit}/>
        }
        <label
          key={"no"}
          className={`${styles.radioLabel} ${selectedValue === 2 ? styles.selected : ''}`}
        >
          {"No"}
          <input
            type="radio"
            value={"no"}
            checked={selectedValue === 2}
            onChange={() => {
              changeSelectedValue(2)
            }}
            className={styles.radioInput}
          />
        </label>
      {/* ))} */}
    </div>
  );
};

export default GoogleLoginComponent;
