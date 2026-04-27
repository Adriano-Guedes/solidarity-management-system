import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import type { UserResponse } from '../types/user';

const FAKE_ADMIN: UserResponse = {
  id: '00000000-0000-0000-0000-000000000001',
  name: 'Admin',
  email: 'admin@system.com',
  active: true,
  createdAt: new Date().toISOString(),
  updatedAt: undefined,
};

interface LoginFormInputs {
  email: string;
  password: string;
}

const palette = {
  primary: '#0B1F3A',       // Azul institucional
  secondary: '#0E7490',     // Teal moderno
  success: '#16A34A',       // Verde ações positivas
  accent: '#22C55E',        // Destaques
  background: '#F8FAFC',    // Fundo geral
  surface: '#FFFFFF',       // Cards/modais
  border: '#CBD5E1',        // Bordas suaves
  textPrimary: '#0F172A',   // Texto principal
  textSecondary: '#475569', // Texto secundário
  danger: '#DC2626',        // Alertas
  warning: '#F59E0B',       // Avisos
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<LoginFormInputs>();

  const onSubmit = (data: LoginFormInputs) => {
    if (
      data.email === FAKE_ADMIN.email &&
      data.password === 'admin123' // senha fixa para exemplo
    ) {
      navigate('/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  const onCreateAccount = () => {
    // Futuramente pode navegar para uma página de cadastro
    alert('Create account clicked!');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: palette.background,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        width: 340,
        background: palette.surface,
        borderRadius: 12,
        boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: `1px solid ${palette.border}`,
      }}>
        <h2 style={{ color: palette.primary, marginBottom: 24 }}>Solidarity Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: palette.textPrimary, fontWeight: 500 }}>Email</label>
            <input type="email" {...register('email')} style={{ width: '100%', padding: 10, marginTop: 4, borderRadius: 6, border: `1px solid ${palette.border}`, color: palette.textPrimary }} required />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ color: palette.textPrimary, fontWeight: 500 }}>Password</label>
            <input type="password" {...register('password')} style={{ width: '100%', padding: 10, marginTop: 4, borderRadius: 6, border: `1px solid ${palette.border}`, color: palette.textPrimary }} required />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" style={{ flex: 1, background: palette.secondary, color: '#fff', border: 'none', borderRadius: 6, padding: 10, fontWeight: 'bold', cursor: 'pointer' }}>Login</button>
            <button type="button" style={{ flex: 1, background: palette.accent, color: palette.primary, border: 'none', borderRadius: 6, padding: 10, fontWeight: 'bold', cursor: 'pointer' }} onClick={onCreateAccount}>Create Account</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
