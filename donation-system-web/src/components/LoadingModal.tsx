import React from 'react';

interface LoadingModalProps {
  show: boolean;
  text?: string;
}

const spinnerStyle: React.CSSProperties = {
  width: 60,
  height: 60,
  border: '6px solid #e5e7eb',
  borderTop: '6px solid #2563EB',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
  margin: '0 auto',
};

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(30, 41, 59, 0.35)',
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'auto',
};

const modalStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 18,
  boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
  padding: '40px 48px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minWidth: 260,
};

const LoadingModal: React.FC<LoadingModalProps> = ({ show, text }) => {
  if (!show) return null;
  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={spinnerStyle} className="loading-spinner" />
        <div style={{ marginTop: 28, fontWeight: 600, color: '#1e293b', fontSize: 18 }}>
          {text || 'Carregando...'}
        </div>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingModal;
