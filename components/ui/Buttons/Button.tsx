import React from 'react';
import styles from '@/custom/CSSFile/default/Index.module.css';

const Button = ({
  variant = 'primary', // Default variant is 'primary'
  children, // This prop will hold the content to display inside the button
}: {
  variant: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}) => {
  let buttonClasses = '';
  
  if (variant === 'primary') {
    buttonClasses = styles.primaryButton; // Define your primary button class
  } else if (variant === 'secondary') {
    buttonClasses = styles.secondaryButton; // Define your secondary button class
  } else if (variant === 'ghost') {
    buttonClasses = styles.ghostButton; // Define your ghost button class
  }

  return (
    <button className={buttonClasses}>
      {children}
    </button>
  );
};

export default Button;

Button.defaultProps = {
  variant: 'primary', // Set the default variant
};
