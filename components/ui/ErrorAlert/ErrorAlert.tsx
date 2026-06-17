import React from 'react';
import { XCircle } from 'lucide-react';
import { ErrorAlertProps } from '@/types/ui';

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, style }) => (
  <div
    style={{
      width: '100%',
      backgroundColor: '#fff5f5',
      border: '1px solid #fecaca',
      borderRadius: '10px',
      padding: '14px 16px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
      ...style,
    }}
  >
    <span style={{ flexShrink: 0, marginTop: '1px', display: 'flex' }}>
      <XCircle size={18} color="#ef4444" />
    </span>
    <p
      style={{
        margin: 0,
        fontSize: '13px',
        color: '#b91c1c',
        lineHeight: '1.5',
      }}
    >
      {message}
    </p>
  </div>
);

export default ErrorAlert;
