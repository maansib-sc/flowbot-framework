import React from 'react';
import { GoogleLogin } from 'react-google-login';
import styles from '@/styles/Home.module.css';

const client_id =
  'GOOGLE_CLIENT_ID_REMOVED';

  interface GoogleSSOProps {
    handleSubmit: (value?:string) => void; // Adjust the function type based on your needs
  }
  

  const GoogleSSO: React.FC<GoogleSSOProps> = ({ handleSubmit }) => {  const onSuccess = (res:any) => {
    console.log('Logged in ', res?.profileObj);
    handleSubmit("yes")
  };

  const onFailure = (res:any) => {
    console.log('Login failed', res);
    handleSubmit("yes")

  };
  return (
    <GoogleLogin
      clientId={client_id}
      buttonText="Google Login"
      onSuccess={onSuccess}
      onFailure={onFailure}
      style={{ color: "black" }}
      cookiePolicy="single_host_origin"
      isSignedIn={true}
      className={styles.customGoogle} // Add a custom class
    />
  );
};

export default GoogleSSO;
