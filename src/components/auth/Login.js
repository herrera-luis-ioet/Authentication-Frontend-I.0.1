import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Container, Box } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../utils/constants';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData.email, formData.password);
            navigate(ROUTES.HOME);
        } catch (error) {
            setError('Failed to login. Please check your credentials.');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Typography component="h1" variant="h5" align="center">
                    Login
                </Typography>
                {error && (
                    <Typography color="error" align="center" sx={{ mt: 2 }}>
                        {error}
                    </Typography>
                )}
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Link to={ROUTES.REGISTER}>
                            {"Don't have an account? Sign Up"}
                        </Link>
                        <Link to={ROUTES.FORGOT_PASSWORD}>
                            {"Forgot password?"}
                        </Link>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;
