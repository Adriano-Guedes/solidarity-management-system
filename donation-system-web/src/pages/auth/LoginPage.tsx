import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import type { UserResponse } from '../../types/user';
import { FiHeart } from 'react-icons/fi';

const FAKE_ADMIN: UserResponse = {
  id: '00000000-0000-0000-0000-000000000001',
  name: 'Admin',
  email: 'admin@solidarity.com',
  active: true,
  createdAt: new Date().toISOString(),
  updatedAt: undefined,
};

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<LoginFormInputs>();

  const onSubmit = (data: LoginFormInputs) => {
    if (
      data.email === FAKE_ADMIN.email &&
      data.password === 'admin123'
    ) {
      navigate('/dashboard');
    } else {
      alert('Credenciais inválidas');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--body-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        width: 380,
        background: 'var(--card-bg)',
        borderRadius: 16,
        boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
        padding: 40,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '1px solid var(--border)',
      }}>
        <div style={{
          width: 52, height: 52,
          background: 'var(--primary)',
          borderRadius: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24,
          color: '#fff',
          marginBottom: 20
        }}>
          <FiHeart />
        </div>
        
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Bem-vindo</h2>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 32, textAlign: 'center' }}>
          Faça login para gerenciar o sistema de doações
        </p>

        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: 6 }}>Email</label>
            <input 
              type="email" 
              {...register('email')} 
              placeholder="seu@email.com"
              style={{ 
                width: '100%', 
                padding: '10px 14px', 
                borderRadius: 10, 
                border: '1px solid var(--border)', 
                color: 'var(--text-main)',
                fontSize: 14,
                outline: 'none',
                background: 'var(--body-bg)'
              }} 
              required 
            />
          </div>
          <div style={{ marginBottom: 28 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: 6 }}>Senha</label>
            <input 
              type="password" 
              {...register('password')} 
              placeholder="••••••••"
              style={{ 
                width: '100%', 
                padding: '10px 14px', 
                borderRadius: 10, 
                border: '1px solid var(--border)', 
                color: 'var(--text-main)',
                fontSize: 14,
                outline: 'none',
                background: 'var(--body-bg)'
              }} 
              required 
            />
          </div>
          <button 
            type="submit" 
            className="btn-primary-custom w-100 py-2 justify-content-center"
            style={{ fontSize: 15 }}
          >
            Entrar no Sistema
          </button>
        </form>
        
        <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border)', width: '100%', textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Precisa de acesso? <span style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>Contate o suporte</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
