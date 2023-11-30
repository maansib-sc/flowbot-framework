import React, { useState } from 'react';
import styles from '@/configuration/CSS/Index.module.css';
import ApplianceProffesional from '@/assets/svgs/icons/ApplianceProffesional';
import Carpenter from '@/assets/svgs/icons/Carpenter';
import Concrete from '@/assets/svgs/icons/Concrete';
import Deck from '@/assets/svgs/icons/Deck';
import Electrician from '@/assets/svgs/icons/Electrician';
import Generate from '@/assets/svgs/icons/Generate';
import Handyman from '@/assets/svgs/icons/Handyman';
import Cleaner from '@/assets/svgs/icons/Cleaner';
import Lawn from '@/assets/svgs/icons/Lawn';
import Painter from '@/assets/svgs/icons/Painter';
import Plumber from '@/assets/svgs/icons/Plumber';

function getIconByLabel(label: any) {
  switch (label) {
    case "Appliance Professional":
      return <ApplianceProffesional />;
    case "Carpenter":
      return <Carpenter />;
    case "Concrete/Masonry Pro":
      return <Concrete />;
    case "Deck Builder":
      return <Deck />;
    case "Electrician":
      return <Electrician />;
    case "General Contractor":
      return <Generate />;
    case "Handyman":
      return <Handyman />;
    case "House Cleaner":
      return <Cleaner />;
    case "Lawn and Landscape Pro":
      return <Lawn />;
    case "Painter":
      return <Painter />;
    case "Plumber":
      return <Plumber />;
    default:
      return <Plumber />; // Unknown label
  }
}


const CardRadioGroup = ({
  options,
  value,
  onChange,
  disabled,
}: {
  options: { label: string; value: string, icon?: React.FC; }[];
  value: string;
  onChange: (value: string) => void;
  disabled: boolean
}) => {

  const [selectedValue, setSelectedValue] = useState<string | null>(value || null)

  const changeSelectedValue = (data: string) => {
    const { label, value } = JSON.parse(data);
    setSelectedValue(value)
    onChange(data)
  }

  return (
    <div className={styles.cardradioGroup}> {/* Apply a class from the imported CSS module */}
      {options.map((option, index) => (
        <label
          key={option.value}
          className={`${styles.radioLabel} ${selectedValue === option.value ? styles.selected : ''}`}
        >
          <div className={styles.cardradioiconcontainer}>
            {option?.label && getIconByLabel(option.label)}
            <span>
              {option.label}
            </span>
          </div>
          <input
            type="radio"
            value={option.value}
            disabled={disabled}
            checked={selectedValue === option.value}
            onChange={() => {
              changeSelectedValue(JSON.stringify(option))
            }}
            className={styles.cardradioInput}
          />
        </label>
      ))}
    </div>
  );
};

export default CardRadioGroup;
