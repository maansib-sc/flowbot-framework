import React, { useState } from 'react';
import styles from '@/styles/Home.module.css';
import Button from '../Buttons/Button';

const ShowDetails = ({ options, onSave }: { options: any, onSave: () => void }) => {
  const [showButton, setShowButton] = useState<Boolean>(true)
  return (
    <div className={styles.detailsContainer}>
      <h3>{options.name}</h3>
      <div className={styles.detailsFlex}>
        <div className={styles.detailsShow}>
          <h6>License Number</h6>
          <span>{options.license_id}</span>
        </div>
        <div className={styles.detailsShow}>
          <h6>Date</h6>
          <span>{options.license_date}</span>
        </div>
      </div>
      <div className={styles.detailsShow}>
        <h6>License Location Address</h6>
        <span>{options.address}</span>
      </div>
      <div className={styles.detailsShow}>
        <h6>Main Address</h6>
        <span>{options.address}</span>
      </div>
      {showButton && <div>
        <Button onClick={() => { onSave(); setShowButton(false) }}>Confirm</Button>
      </div>}
    </div>
  );
};

export default ShowDetails;
