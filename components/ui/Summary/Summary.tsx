import React from 'react';
import styles from './Summary.module.css';

const dummy = [
  {
    header: 'Contact Information',
    step: 1,
    data: [
      {
        label: 'label',
        value: 'value',
      },
    ],
  },
];

const Summary = () => {
  return (
    <div>
      <span className={styles.span}>
        Here is a summary of the information that you provided, please review
      </span>
      <div className={styles.bodyContainer}>
        {dummy?.map((it, index) => {
          return (
            <div className={styles.itemContainer} key={index}>
              <div className={styles?.headerContainer}>
                <div className={styles?.stepCircle}>{it.step}</div>
                <div className={styles?.stepText}>{it.header}</div>
              </div>
              <div className={styles.mapContainer}>
                {it?.data?.map((i,ind) => {
                  return (
                    <div className={styles.item} key={ind}>
                      <h3 className={styles.h3}>{i.label}</h3>
                      <span className={styles.span}>{i.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Summary;
