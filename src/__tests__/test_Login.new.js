import React from 'react';
import { render, screen, fireEvent, waitFor, act } from './test-utils';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Login from '../components/auth/Login';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form with required fields', async () => {
    await act(async () => {
      render(<Login />);
    });
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('displays error when submitting empty form', async () => {
    await act(async () => {
      render(<Login />);
    });
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await act(async () => {
      fireEvent.click(submitButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  test('displays error for invalid email format', async () => {
    await act(async () => {
      render(<Login />);
    });
    
    const emailInput = screen.getByLabelText(/email/i);
    
    await act(async () => {
      await userEvent.type(emailInput, 'invalid-email');
      fireEvent.blur(emailInput);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  test('handles successful login', async () => {
    await act(async () => {
      render(<Login />);
    });
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    await act(async () => {
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    });
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('displays error message on login failure', async () => {
    await act(async () => {
      render(<Login />);
    });
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    await act(async () => {
      await userEvent.type(emailInput, 'wrong@example.com');
      await userEvent.type(passwordInput, 'wrongpassword');
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    });
    
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  test('navigates to register page when clicking register link', async () => {
    await act(async () => {
      render(<Login />);
    });
    
    const registerLink = screen.getByText(/don't have an account\\? sign up/i);
    
    await act(async () => {
      fireEvent.click(registerLink);
    });
    
    expect(mockNavigate).toHaveBeenCalledWith('/register');
  });

  test('navigates to forgot password page when clicking forgot password link', async () => {
    await act(async () => {
      render(<Login />);
    });
    
    const forgotPasswordLink = screen.getByText(/forgot password\\?/i);
    
    await act(async () => {
      fireEvent.click(forgotPasswordLink);
    });
    
    expect(mockNavigate).toHaveBeenCalledWith('/forgot-password');
  });
});