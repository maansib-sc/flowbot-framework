import { useEffect, useState } from 'react';
import styles from './CostCards.module.css'; // Import CSS module

interface CostCardsProps {
    options: any;
    onChange : (val:any)=>void;
}

const CostCards: React.FC<CostCardsProps> = ({ options,onChange }) => {
    // useEffect(()=>{
    //     setTimeout(()=>{
    //         onChange("")
    //     },1000)
    // },[])


  return (
    <div className={styles.CostCards}>
        {options.map((item:any,index:any)=>{
            return(
                <div key={index} className={styles.Card}>
                    <span className={styles.text}>{item.text}</span>
                    <h3 className={styles.price}>{item.price}</h3>
                </div>
            )
        })}
    </div>
  );
};

export default CostCards;
