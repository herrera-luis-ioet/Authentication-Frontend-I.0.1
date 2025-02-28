import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

// PUBLIC_INTERFACE
export const login = async (username, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        
        if (!response.ok) {
            throw new Error('Login failed');
        }
        
        const data = await response.json();
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data.user));
        return data;
    } catch (error) {
        throw error;
    }
};

// PUBLIC_INTERFACE
export const register = async (userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        
        if (!response.ok) {
            throw new Error('Registration failed');
        }
        
        return await response.json();
    } catch (error) {
        throw error;
    }
};

// PUBLIC_INTERFACE
export const forgotPassword = async (email) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        
        if (!response.ok) {
            throw new Error('Password reset request failed');
        }
        
        return await response.json();
    } catch (error) {
        throw error;
    }
};

// PUBLIC_INTERFACE
export const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
};
