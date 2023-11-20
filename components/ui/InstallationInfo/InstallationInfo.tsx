import React, { useEffect } from 'react'
import styles from "./InstallationInfo.module.css";

interface InstallationInfoProps {
    onChange : (val:any)=>void;
}

const InstallationInfo: React.FC<InstallationInfoProps> = ({ onChange }) => {

    // useEffect(()=>{
    //     setTimeout(() => {
    //         onChange("")
    //     }, 3000);
    // },[]);

  return (
    <div>
        <span className={styles.span}>
        If you want to know what is included in your installation, please click the Installation Info link below
        </span>
        <p  className={styles.p}>
        Installation Info
        </p>
    </div>
  )
}

export default InstallationInfo