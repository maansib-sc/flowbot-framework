import React, { useContext } from 'react';
import ThemeContext from '@/contexts/ThemeContext';

const Button = ({
  variant = 'primary', // Default variant is 'primary',
  children, // This prop will hold the content to display inside the button
  onClick, // Add onClick prop,
  disabled = false,
  ...props
}: {
  variant: 'primary' | 'secondary' | 'ghost' | 'link';
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void; // Define the onClick prop with the appropriate type
}) => {
  const { styles } = useContext(ThemeContext);
  let buttonClasses = '';

  if (variant === 'primary') {
    buttonClasses = styles.primaryButton; // Define your primary button class
  } else if (variant === 'secondary') {
    buttonClasses = styles.secondaryButton; // Define your secondary button class
  } else if (variant === 'ghost') {
    buttonClasses = styles.ghostButton; // Define your ghost button class
  } else if (variant === 'link') {
    buttonClasses = styles.linkButton; // Define your ghost button class
  }

  return (
    <button
      className={buttonClasses}
      {...props}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;

Button.defaultProps = {
  variant: 'primary', // Set the default variant
};
