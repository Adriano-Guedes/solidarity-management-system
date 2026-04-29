import React from 'react';

interface RoundedButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  color?: string;
  background?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const RoundedButton: React.FC<RoundedButtonProps> = ({
  children,
  onClick,
  color = '#fff',
  background = '#2563EB',
  style = {},
  disabled = false,
  type = 'button',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        border: 'none',
        borderRadius: 999,
        padding: '7px 20px',
        fontWeight: 600,
        fontSize: 12,
        color,
        background,
        boxShadow: '0 15px 12px rgba(0, 0, 0, 0.1)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 0.2s, box-shadow 0.2s, color 0.2s',
        outline: 'none',
        ...style,
      }}
      onMouseOver={e => {
        if (!disabled) {
          (e.currentTarget as HTMLButtonElement).style.opacity = '0.85';
        }
      }}
      onMouseOut={e => {
        if (!disabled) {
          (e.currentTarget as HTMLButtonElement).style.opacity = '1';
        }
      }}
    >
      {children}
    </button>
  );
};

export default RoundedButton;
