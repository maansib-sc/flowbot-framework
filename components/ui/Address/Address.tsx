import React from 'react';
import SelectInput from '../SelectInput/SelectInput'; // Import the SelectInput component
import TextInput from '../Input/TextInput';
import styles from "../../../configuration/CSS/Index.module.css"

interface Option {
  label: string;
  value: string;
}

interface AddressProps {
  cities: Option[]; // An array of city options
  states: Option[]; // An array of state options
  zip: String;
  street: String;
}

const Address: React.FC<AddressProps> = ({ cities, states, zip, street }) => {
  return (
    <div className={styles.Address}>
      <div className={styles.Address_topcontainer}>
        <SelectInput options={states} value="" onChange={() => { }} label='State' />
        <SelectInput options={cities} value="" onChange={() => { }} label='City' />
        <TextInput label='Zip Code' />
      </div>
      <TextInput label='Street Address' width="100%" containerwidth='100%' />

    </div>
  );
};

export default Address;
