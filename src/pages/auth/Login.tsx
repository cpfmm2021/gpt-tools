import React from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const Login: React.FC = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            {t('auth.login')}
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={t('auth.email')}
              autoComplete="email"
              autoFocus
              {...register('email', {
                required: t('errors.required'),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t('errors.invalidEmail'),
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label={t('auth.password')}
              type="password"
              id="password"
              autoComplete="current-password"
              {...register('password', {
                required: t('errors.required'),
                minLength: {
                  value: 6,
                  message: t('errors.minimumLength', { length: 6 }),
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  {...register('rememberMe')}
                />
              }
              label={t('auth.rememberMe')}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              {t('auth.signIn')}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link
                component={RouterLink}
                to="/register"
                variant="body2"
              >
                {t('auth.noAccount')}
              </Link>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
