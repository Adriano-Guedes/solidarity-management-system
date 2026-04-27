import React from 'react';

interface ActionButtonProps {
  icon: React.ReactNode;
  text?: string;
  title?: string;
  onClick: () => void;
  action: 'primary' | 'secondary' | 'info' | 'danger' | 'success' | 'warning' | string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  text,
  title,
  onClick,
  action,
  disabled = false,
  style = {},
}) => {
  // Bootstrap color mapping
  const colorClass = action
    ? `btn btn-${action}`
    : 'btn btn-secondary';

  return (
    <button
      className={colorClass}
      title={title}
      onClick={onClick}
      disabled={disabled}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}
    >
      {icon}
      {text && <span style={{ marginLeft: 4 }}>{text}</span>}
    </button>
  );
};

export default ActionButton;
