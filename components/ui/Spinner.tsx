import React from 'react';

const Spinner: React.FC<{ size?: number; color?: string }> = ({ size = 12, color = 'currentColor' }) => (
    <span
        style={{
            width: size,
            height: size,
            border: `2px solid #e5e7eb`,
            borderTopColor: color,
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
            display: 'inline-block',
        }}
    />
);

export default Spinner;
