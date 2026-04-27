import React from 'react';

interface TableIconButtonProps {
  icon: React.ReactNode;
  title?: string;
  onClick: () => void;
  bgColor?: string;
  disabled?: boolean;
  size?: number;
  style?: React.CSSProperties;
}

const TableIconButton: React.FC<TableIconButtonProps> = ({
  icon,
  title,
  onClick,
  bgColor = 'secondary',
  disabled = false,
  size = 36,
  style = {},
}) => {
  return (
    <button
      type="button"
      className={`btn rounded-circle p-0 d-flex align-items-center justify-content-center`}
      title={title}
      onClick={onClick}
      disabled={disabled}
      style={{ backgroundColor: bgColor, width: size, height: size, minWidth: size, minHeight: size, ...style }}
    >
      {icon}
    </button>
  );
};

export default TableIconButton;
