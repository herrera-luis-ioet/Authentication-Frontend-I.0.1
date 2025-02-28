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

// Create a custom matcher for checking focus
expect.extend({
  toHaveFocus(received) {
    const pass = received === document.activeElement;
    return {
      message: () => `expected element ${pass ? 'not ' : ''}to have focus`,
      pass,
    };
  },
});

describe('Login Component', () => {
  const renderLogin = () => {
    return render(<Login />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form with required fields', () => {
    renderLogin();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('displays error when submitting empty form', async () => {
    renderLogin();
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  test('displays error for invalid email format', async () => {
    renderLogin();
    const emailInput = screen.getByLabelText(/email/i);
    
    await userEvent.type(emailInput, 'invalid-email');
    fireEvent.blur(emailInput);
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  test('handles successful login', async () => {
    renderLogin();
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('displays error message on login failure', async () => {
    renderLogin();
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    await userEvent.type(emailInput, 'wrong@example.com');
    await userEvent.type(passwordInput, 'wrongpassword');
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  describe('Navigation Links', () => {
    let registerLink;
    let forgotPasswordLink;

    beforeEach(() => {
      renderLogin();
      registerLink = screen.getByText(/don't have an account\? sign up/i);
      forgotPasswordLink = screen.getByText(/forgot password\?/i);
    });

    test('renders navigation links correctly', () => {
      expect(registerLink).toBeInTheDocument();
      expect(forgotPasswordLink).toBeInTheDocument();
      expect(registerLink).toHaveAttribute('href', '/register');
      expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password');
    });

    test('navigates to register page when clicking register link', () => {
      fireEvent.click(registerLink);
      expect(mockNavigate).toHaveBeenCalledWith('/register');
    });

    test('navigates to forgot password page when clicking forgot password link', () => {
      fireEvent.click(forgotPasswordLink);
      expect(mockNavigate).toHaveBeenCalledWith('/forgot-password');
    });

    describe('Keyboard Accessibility', () => {
      test('navigation links are keyboard accessible', async () => {
        const user = userEvent.setup();
        
        // Tab to register link
        await user.tab(); // email
        await user.tab(); // password
        await user.tab(); // submit
        await user.tab(); // register link
        expect(registerLink).toHaveFocus();
        
        // Activate register link with Enter
        await user.keyboard('{Enter}');
        expect(mockNavigate).toHaveBeenCalledWith('/register');
        
        // Tab to forgot password link
        await user.tab();
        expect(forgotPasswordLink).toHaveFocus();
        
        // Activate forgot password link with Space
        await user.keyboard(' ');
        expect(mockNavigate).toHaveBeenCalledWith('/forgot-password');
      });

      test('supports reverse tab navigation', async () => {
        const user = userEvent.setup();
        
        // Focus the last element
        await user.tab(); // email
        await user.tab(); // password
        await user.tab(); // submit
        await user.tab(); // register
        await user.tab(); // forgot password
        expect(forgotPasswordLink).toHaveFocus();
        
        // Tab backwards
        await user.keyboard('{Shift>}{Tab}{/Shift}');
        expect(registerLink).toHaveFocus();
      });
    });

    describe('Accessibility Features', () => {
      test('navigation links have proper ARIA attributes', () => {
        expect(registerLink).toHaveAttribute('role', 'link');
        expect(forgotPasswordLink).toHaveAttribute('role', 'link');
        expect(registerLink).toHaveAttribute('aria-label', 'Sign up for a new account');
        expect(forgotPasswordLink).toHaveAttribute('aria-label', 'Reset your password');
      });

      test('focus management follows logical tab order', async () => {
        const user = userEvent.setup();
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /sign in/i });
        
        // Check initial focus
        expect(emailInput).toHaveFocus();
        
        // Verify tab order
        await user.tab();
        expect(passwordInput).toHaveFocus();
        
        await user.tab();
        expect(submitButton).toHaveFocus();
        
        await user.tab();
        expect(registerLink).toHaveFocus();
        
        await user.tab();
        expect(forgotPasswordLink).toHaveFocus();
      });

      test('focus is trapped within the form', async () => {
        const user = userEvent.setup();
        const emailInput = screen.getByLabelText(/email/i);
        
        // Tab through all elements
        await user.tab(); // email
        await user.tab(); // password
        await user.tab(); // submit
        await user.tab(); // register
        await user.tab(); // forgot password
        await user.tab(); // should loop back to email
        
        expect(emailInput).toHaveFocus();
      });

      test('focus is preserved after navigation attempt', async () => {
        const user = userEvent.setup();
        
        // Focus the register link
        await user.tab(); // email
        await user.tab(); // password
        await user.tab(); // submit
        await user.tab(); // register
        expect(registerLink).toHaveFocus();
        
        // Trigger navigation
        await user.keyboard('{Enter}');
        
        // Focus should remain on the link until navigation completes
        expect(registerLink).toHaveFocus();
      });
    });
  });
});
