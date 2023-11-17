import React, { useEffect } from 'react';
import { GoogleLogin } from 'react-google-login';
import styles from '@/styles/Home.module.css';
import { gapi } from 'gapi-script';

const client_id =
  'GOOGLE_CLIENT_ID_REMOVED';

interface GoogleSSOProps {
  handleSubmit: (value?: string) => void; // Adjust the function type based on your needs
}

const GoogleSSO: React.FC<GoogleSSOProps> = ({ handleSubmit }) => {
  const onSuccess = (res: any) => {
    console.log('Logged in ', res?.profileObj);
    handleSubmit('yes');
  };

  const onFailure = (res: any) => {
    console.log('Login failed', res);
    handleSubmit('yes');
  };

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: client_id,
        scope: 'email',
      });
    }
    gapi.load('client:auth2', start);
  }, []);

  return (
    <GoogleLogin
      clientId={client_id}
      buttonText="Google Login"
      onSuccess={onSuccess}
      onFailure={onFailure}
      style={{ color: 'black' }}
      cookiePolicy="single_host_origin"
      isSignedIn={true}
      className={styles.customGoogle} // Add a custom class
    />
  );
};

export default GoogleSSO;
