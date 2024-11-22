import React from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const { t } = useTranslation();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data.name, data.email, data.password);
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
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
            {t('auth.register')}
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label={t('common.name')}
              autoFocus
              {...register('name', {
                required: t('errors.required'),
                minLength: {
                  value: 2,
                  message: t('errors.minimumLength', { length: 2 }),
                },
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={t('auth.email')}
              autoComplete="email"
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
            <TextField
              margin="normal"
              required
              fullWidth
              label={t('auth.confirmPassword')}
              type="password"
              id="confirmPassword"
              {...register('confirmPassword', {
                required: t('errors.required'),
                validate: (value) =>
                  value === password || t('errors.passwordMismatch'),
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              {t('auth.signUp')}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link
                component={RouterLink}
                to="/login"
                variant="body2"
              >
                {t('auth.haveAccount')}
              </Link>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
