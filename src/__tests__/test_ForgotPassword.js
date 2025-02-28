import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import ForgotPassword from '../components/auth/ForgotPassword';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('ForgotPassword Component', () => {
  const renderForgotPassword = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <ForgotPassword />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders forgot password form with email field', () => {
    renderForgotPassword();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset password/i })).toBeInTheDocument();
  });

  test('displays error when submitting empty form', async () => {
    renderForgotPassword();
    const submitButton = screen.getByRole('button', { name: /reset password/i });
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  test('displays error for invalid email format', async () => {
    renderForgotPassword();
    const emailInput = screen.getByLabelText(/email/i);
    
    await userEvent.type(emailInput, 'invalid-email');
    fireEvent.blur(emailInput);
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  test('handles successful password reset request', async () => {
    renderForgotPassword();
    const emailInput = screen.getByLabelText(/email/i);
    
    await userEvent.type(emailInput, 'test@example.com');
    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/password reset email sent/i)).toBeInTheDocument();
    });
  });

  test('displays error message on password reset failure', async () => {
    renderForgotPassword();
    const emailInput = screen.getByLabelText(/email/i);
    
    await userEvent.type(emailInput, 'nonexistent@example.com');
    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/email not found/i)).toBeInTheDocument();
    });
  });

  test('navigates to login page when clicking back to login link', () => {
    renderForgotPassword();
    const loginLink = screen.getByText(/back to login/i);
    
    fireEvent.click(loginLink);
    
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('disables submit button while processing', async () => {
    renderForgotPassword();
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /reset password/i });
    
    await userEvent.type(emailInput, 'test@example.com');
    fireEvent.click(submitButton);
    
    expect(submitButton).toBeDisabled();
    
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  test('clears error message when user starts typing', async () => {
    renderForgotPassword();
    const emailInput = screen.getByLabelText(/email/i);
    
    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
    
    await userEvent.type(emailInput, 't');
    expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();
  });
});