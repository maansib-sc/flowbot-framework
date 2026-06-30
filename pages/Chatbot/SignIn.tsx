import React from 'react';
import { SignInScreenProps } from '@/types/chat';
import SignInIllustration from '@/assets/svgs/icons/SignInIllustration';
import GoogleIcon from '@/assets/svgs/icons/GoogleIcon';
import { ErrorAlert } from '@/components/ui';

export const SignInScreen: React.FC<SignInScreenProps> = ({
  JSModule,
  onLogin,
  error,
}) => {
  const steps = JSModule?.howToUseSteps || [];
  const hasError = !!error;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        padding: '32px 24px',
      }}
    >
      <div style={{ marginBottom: '24px' }}>
        <SignInIllustration />
      </div>

      {/* Title */}
      <h2
        style={{
          margin: '0 0 10px',
          fontSize: '24px',
          fontWeight: 700,
          color: '#111827',
          textAlign: 'center',
          letterSpacing: '-0.3px',
        }}
      >
        {hasError ? 'Sign in failed' : `Welcome to ${JSModule?.botName}`}
      </h2>

      {/* Subtitle */}
      <p
        style={{
          margin: '0 0 24px',
          fontSize: '14px',
          color: '#6b7280',
          textAlign: 'center',
          maxWidth: '300px',
          lineHeight: '1.6',
        }}
      >
        {hasError
          ? "We couldn't sign you in with Google. Please try again."
          : JSModule?.welcomeMessage}
      </p>

      {/* Error message box */}
      {hasError && (
        <ErrorAlert
          message={error as string}
          style={{ maxWidth: '400px', marginBottom: '20px' }}
        />
      )}

      {/* How to use steps — hidden in error state */}
      {!hasError && steps.length > 0 && (
        <div
          style={{
            width: '100%',
            maxWidth: '400px',
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '14px',
            padding: '20px 24px',
            marginBottom: '24px',
          }}
        >
          <p
            style={{
              margin: '0 0 18px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: '#9ca3af',
              textTransform: 'uppercase',
            }}
          >
            How to use
          </p>
          {steps.map((step: any, i: number) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                marginBottom: i < steps.length - 1 ? '18px' : 0,
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: '#4f6ef7',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 700,
                }}
              >
                {step.number}
              </div>
              <div style={{ paddingTop: '2px' }}>
                <p style={{ margin: '0 0 3px', fontSize: '14px', fontWeight: 700, color: '#111827', lineHeight: '1.3' }}>
                  {step.title}
                </p>
                <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', lineHeight: '1.5' }}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Primary button */}
      <button
        onClick={onLogin}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          width: '100%',
          maxWidth: '400px',
          padding: '15px 20px',
          backgroundColor: '#4355d4',
          color: '#fff',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontSize: '15px',
          fontWeight: 600,
          marginBottom: hasError ? '12px' : '14px',
          letterSpacing: '0.1px',
        }}
      >
        <GoogleIcon />
        {hasError ? 'Try again with Google' : 'Continue with Google'}
      </button>

      {/* Error: "Try a different account" link */}
      {hasError && (
        <button
          onClick={onLogin}
          style={{
            background: 'none',
            border: 'none',
            color: '#4f6ef7',
            fontSize: '13px',
            cursor: 'pointer',
            padding: '4px 0',
            marginBottom: '8px',
          }}
        >
          Try a different account
        </button>
      )}

      {/* Terms — hidden in error state */}
      {!hasError && (
        <p
          style={{
            fontSize: '12px',
            color: '#9ca3af',
            textAlign: 'center',
            maxWidth: '340px',
            lineHeight: '1.5',
            margin: 0,
          }}
        >
          By continuing, you agree to our{' '}
          <span style={{ color: '#4f6ef7', cursor: 'pointer' }}>Terms of Service</span>
          {' '}and{' '}
          <span style={{ color: '#4f6ef7', cursor: 'pointer' }}>Privacy Policy</span>
        </p>
      )}
    </div>
  );
};

export default SignInScreen;