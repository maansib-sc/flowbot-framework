import React, { useState } from 'react';
import styles from '@/styles/Home.module.css';
import Button from '../Buttons/Button';

const ShowDetails = ({ onSave }: { onSave: () => void }) => {
  const [showButton, setShowButton] = useState<Boolean>(true)
  return (
    <div className={styles.detailsContainer}>
      <h3>PERRONE CONSTRUCTION INCORPORATED</h3>
      <div className={styles.detailsFlex}>
        <div className={styles.detailsShow}>
          <h6>License Number</h6>
          <span>CBC017177</span>
        </div>
        <div className={styles.detailsShow}>
          <h6>Date</h6>
          <span>08/31/2024</span>
        </div>
      </div>
      <div className={styles.detailsShow}>
        <h6>License Location Address</h6>
        <span>7045 S TAMIAMI TRAIL SARASOTA, FL 34231</span>
      </div>
      <div className={styles.detailsShow}>
        <h6>Main Address</h6>
        <span>7045 S TAMIAMI TRAIL SARASOTA, FL 34231</span>
      </div>
      {showButton && <div>
        <Button onClick={() => { onSave(); setShowButton(false) }}>Confirm</Button>
      </div>}
    </div>
  );
};

export default ShowDetails;
