import React, { useState, useEffect } from 'react';
import styles from '@/configuration/CSS/Index.module.css';
import { useSession, signIn, signOut } from "next-auth/react";

const GoogleLoginComponent = ({
  handleSubmit,
  value,
  options,
  // onChange,
}: {
  options: { label: string; value: string }[];
  value: string;
  // onChange: (value: string) => void;
  handleSubmit: (val?: string) => void;
}) => {

  const [selectedValue, setSelectedValue] = useState(value);
  const [openPopup, setOpenPopup] = useState(false);

  const { data: session, status } = useSession();

  const popupCenter = (url: string, title: string) => {
    const dualScreenLeft = window.screenLeft ?? window.screenX;
    const dualScreenTop = window.screenTop ?? window.screenY;

    const width =
      window.innerWidth ?? document.documentElement.clientWidth ?? screen.width;

    const height =
      window.innerHeight ??
      document.documentElement.clientHeight ??
      screen.height;

    const systemZoom = width / window.screen.availWidth;

    const left = (width - 500) / 2 / systemZoom + dualScreenLeft;
    const top = (height - 550) / 2 / systemZoom + dualScreenTop;

    const newWindow = window.open(
      url,
      title,
      `width=${500 / systemZoom},height=${550 / systemZoom
      },top=${top},left=${left}`
    );

    newWindow?.focus();
  };

  const changeSelectedValue = (item: string) => {
    if (item === "Yes") {
      if (status === "authenticated") {
        handleSubmit(session.user.email || "")
      } else {
        setOpenPopup(true)
        popupCenter("/google-signin", "Sample Sign In")
        // signIn("google")
      }
      setSelectedValue(item)
    } else {
      setSelectedValue(item)
      handleSubmit("No")
      // onChange("no")
    }
  }

  useEffect(() => {
    if (status === "authenticated" && openPopup) {
      handleSubmit(session.user.email || "")
    }
  }, [status])

  console.log(status)

  console.log(selectedValue)
  return (
    <div className={styles.radioGroup}> {/* Apply a class from the imported CSS module */}
      {/* {options.map((option, index) => ( */}
      <label
        key={"yes"}
        className={`${styles.radioLabel} ${selectedValue === "Yes" ? styles.selected : ''}`}
      >
        {"Yes"}
        <input
          type="radio"
          value={"yes"}
          checked={selectedValue === "Yes"}
          onChange={() => {
            changeSelectedValue("Yes")
          }}
          className={styles.radioInput}
        />
      </label>
      {/* {selectedValue == 1 && 
        <GoogleSSO handleSubmit={handleSubmit}/>
        } */}
      {<label
        key={"no"}
        className={`${styles.radioLabel} ${selectedValue === "No" ? styles.selected : ''}`}
      >
        {"No"}
        <input
          type="radio"
          value={"no"}
          checked={selectedValue === "No"}
          onChange={() => {
            changeSelectedValue("No")
          }}
          className={styles.radioInput}
        />
      </label>}
      {/* ))} */}
    </div>
  );
};

export default GoogleLoginComponent;
