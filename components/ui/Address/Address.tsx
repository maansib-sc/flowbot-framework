import React from 'react';
import SelectInput from '../SelectInput/SelectInput'; // Import the SelectInput component
import TextInput from '../Input/TextInput';
import styles from "../../../configuration/CSS/Index.module.css"
import Button from '../Buttons/Button';

interface Option {
  label: string;
  value: string;
}

interface AddressProps {
  cities: Option[]; // An array of city options
  states: Option[]; // An array of state options
  zip: String;
  street: String;
  onSave: ()=>void;
}

const Address: React.FC<AddressProps> = ({ cities, states, zip, street,onSave }) => {
  return (
    <div className={styles.Address}>
      <div className={styles.Address_topcontainer}>
        <SelectInput options={states} value="" onChange={() => { }} label='State' />
        <SelectInput options={cities} value="" onChange={() => { }} label='City' />
        <TextInput label='Zip Code' />
      </div>
      <TextInput label='Street Address' width="100%" containerwidth='100%' />
      <div>
      <Button onClick={onSave}>Save</Button>
      </div>
    </div>
  );
};

export default Address;
