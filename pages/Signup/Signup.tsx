import Button from '@/components/ui/Buttons/Button';
import styles from './Signup.module.css';
import ChatIcon from '@/assets/svgs/ChatIcon';
import { useState } from 'react';
import Signupform from '@/subcomponents/SignupForm/Signupform';
import RegisterationGuy from '@/assets/svgs/RegisterationGuy';

const Signup = () => {
  const [step, setStep] = useState(1);
  const [isSignupPage, setIsSignupPage] = useState(false);

  return (
    <div className={styles['signup']}>
      <div className={styles['sidebar']}>sidebar</div>
      <div className={styles['main-content']}>
        <div className={styles['main-header']}>
          <span>Professional Sign-up Channel</span>
          <Button variant="link">
            <ChatIcon />
            Chat with Platform Support
          </Button>
        </div>
        <div className={styles['main']}>
          {!isSignupPage ? (
            <div className={styles['registerguy']}>
              <RegisterationGuy />
              <h3>Registeration with Libby</h3>
              <span>
                Libby will guide you through the registration process and will
                answer any questions that you have. If you experience any
                platform issues during the registration process, click the “Chat
                with Platform Support” button on the top right of the channel
                during the sign-up process.
              </span>
              <Button>
                {`Get Started →`}
              </Button>
            </div>
          ) : (
            <Signupform />
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
