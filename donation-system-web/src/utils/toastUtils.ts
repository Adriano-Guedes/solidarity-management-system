import { toast, type ToastOptions } from 'react-toastify';
import { COLORS } from '../constants/colors';

interface BackendError {
  StatusCode?: number;
  Message?: string;
  Trace?: string;
}

const defaultOptions: ToastOptions = {
  position: "bottom-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "colored",
  style: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '14px',
    borderRadius: '12px',
  }
};

export const showSuccess = (message: string) => {
  toast.success(message, {
    ...defaultOptions,
    style: { ...defaultOptions.style, backgroundColor: COLORS.success }
  });
};

export const showWarning = (message: string) => {
  toast.warn(message, {
    ...defaultOptions,
    style: { ...defaultOptions.style, backgroundColor: COLORS.warning }
  });
};

export const showError = (error: any) => {
  const genericMessage = "Ocorreu um erro inesperado. Tente novamente mais tarde.";
  let displayMessage = genericMessage;
  
  if (error && typeof error === 'object') {
    // Determine the source of the error data (direct object or Axios response)
    const errorData = error.response?.data || error;
    
    // Check for strict backend format: StatusCode, Message, Trace
    if (
      errorData && 
      typeof errorData === 'object' && 
      'Message' in errorData
    ) {
      const { StatusCode, Message } = errorData as BackendError;
      displayMessage = StatusCode 
        ? `Erro ${StatusCode}: ${Message}`
        : Message || genericMessage;
    } else if (error.message && !error.response) {
      // Network error or other Axios error without response
      displayMessage = error.message;
    }
  } else if (typeof error === 'string') {
    displayMessage = error;
  }

  toast.error(displayMessage, {
    ...defaultOptions,
    style: { 
      ...defaultOptions.style,
      backgroundColor: COLORS.danger,
    }
  });
};

export const notificationService = {
  success: showSuccess,
  warning: showWarning,
  error: showError,
};
