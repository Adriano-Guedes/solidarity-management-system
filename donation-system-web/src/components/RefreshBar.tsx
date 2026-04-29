import React from 'react';
import RoundedButton from './RoundedButton';
import { FaArrowLeft, FaSync } from 'react-icons/fa';
import { COLORS } from '../constants';

interface RefreshBarProps {
  onRefresh: () => void;
  loading?: boolean;
  label?: string;
  onBack?: () => void;
  backLabel?: string;
}

const RefreshBar: React.FC<RefreshBarProps> = ({ onRefresh, loading = false, label, onBack, backLabel }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', margin: '24px 0 32px 0', width: '100%', gap: 8 }}>
      <div>
        {onBack && (
          <RoundedButton
            onClick={onBack}
            background={COLORS.secondary}
            color={COLORS.white}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <FaArrowLeft style={{ marginRight: label ? 8 : 0 }} /> {backLabel || 'Voltar'}
          </RoundedButton>
        )}
      </div>
      <RoundedButton
        onClick={onRefresh}
        background={COLORS.secondary}
        color={COLORS.white}
        disabled={loading}
        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
      >
        <FaSync style={{ marginRight: label ? 8 : 0 }} />
        {label || 'Atualizar'}
      </RoundedButton>
    </div>
  );
};

export default RefreshBar;
