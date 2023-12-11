import React, { useState, useEffect } from 'react';
import styles from '@/configuration/CSS/Index.module.css';

const GoogleLoginComponent = ({
  handleSubmit,
  value,
  options,
  disabled,
  // onChange,
}: {
  options: { label: string; value: string }[];
  value: string;
  disabled: boolean;
  // onChange: (value: string) => void;
  handleSubmit: (val?: string) => void;
}) => {

  const [selectedValue, setSelectedValue] = useState(value);
  const [openPopup, setOpenPopup] = useState(false);
  const [firstRender, setFirstRender] = useState(true);


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
      if (!firstRender) {
        // console.log("already authenticated and not first render")
        // handleSubmit(session.user.email || "")
      } else {
        setOpenPopup(true)
        setFirstRender(false)
        popupCenter(`https://accounts.google.com/o/oauth2/auth/oauthchooseaccount?prompt=select_account&access_type=offline&response_type=code&client_id=389664003125-h99no2v9bjfj9bfpq49nvtlagujm59nt.apps.googleusercontent.com&scope=profile%20email&redirect_uri=${process.env.NEXT_PUBLIC_NEXTAUTH_CALLBACK_ENCODED_URL}&service=lso&o2v=1&theme=glif&flowName=GeneralOAuthFlow`, "Sample Sign In")
      }
      setSelectedValue(item)
    } else {
      setSelectedValue(item)
      handleSubmit("No")
    }
  }

  useEffect(() => {
    localStorage.removeItem('email');
    const getDataFromLocalStorage = () => {
      const email = localStorage.getItem('email');
      if (email) {
        handleSubmit(email)
      }
    };

    getDataFromLocalStorage();

    const handleStorageChange = (event) => {
      if (event.key === 'email') {
        getDataFromLocalStorage();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


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
          disabled={disabled}
          checked={selectedValue === "Yes"}
          onChange={() => {
            changeSelectedValue("Yes")
          }}
          className={styles.radioInput}
        />
      </label>
      
      {<label
        key={"no"}
        className={`${styles.radioLabel} ${selectedValue === "No" ? styles.selected : ''}`}
      >
        {"No"}
        <input
          type="radio"
          disabled={disabled}
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
