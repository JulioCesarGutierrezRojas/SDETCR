import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../../../styles/form-login.module.css';
import { login } from "../adapters/auth.controller.js";
import { showSuccessToast, showWarningToast } from "../../../kernel/alerts.js";
import { validateEmail, validatePassword } from "../../../kernel/validations"
import { useSocket } from '../../../context/SocketContext';
import { useAuth } from '../../../context/AuthContext';
import logoSdetcr from '../../../assets/logo-sdetcr.jpeg';

const LoginForm = () => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();
  const { connectSocket } = useSocket();
  const { login: setUserInContext } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    setEmailError(emailValidation);
    setPasswordError(passwordValidation);

    if (emailValidation || passwordValidation) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await login(email, password);
      showSuccessToast({ title: 'Inicio de Sesión Exitoso', text: response.text });

      // Actualizar el estado del AuthContext con los datos del usuario
      const name = localStorage.getItem('user');
      const role = localStorage.getItem('role');
      const userEmail = localStorage.getItem('email');
      const userId = localStorage.getItem('userId');
      
      setUserInContext({
        name,
        role,
        email: userEmail,
        id: userId
      });

      // Conectar Socket.IO después del login exitoso
      const token = localStorage.getItem('token');
      if (token) {
        connectSocket(token);
      }
      switch (role) {
        case 'administrador':
          navigate('/admin');
          break;
        case 'mentor':
          navigate('/teacher');
          break;
        case 'estudiantes':
          navigate('/student');
          break;
      }
    } catch (error) {
      // Los mensajes de error específicos ya están personalizados en auth.controller.js
      showWarningToast({ 
        title: 'Error de Autenticación', 
        text: error.message || 'Ocurrió un error al intentar iniciar sesión' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.logoContainer}>
          <div className={styles.logoWrapper}>
            <img src={logoSdetcr} alt="SDETCR Logo" className={styles.logo} />
          </div>
          <h1 className={styles.appName}>SDETCR</h1>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2 className={styles.title}>Bienvenido a SDETCR</h2>
          <p className={styles.subtitle}>Ingresa a tu cuenta</p>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              className={styles.input}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@ejemplo.com"
              required
            />
            {emailError && <p className={styles.error}>{emailError}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Contraseña</label>
            <div className={styles.passwordInputGroup}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className={styles.input}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
            {passwordError && <p className={styles.error}>{passwordError}</p>}
          </div>

          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>

          <div className={styles.linksContainer}>
            <Link to="/forgot-password" className={styles.link}>
              ¿Olvidaste tu contraseña?
            </Link>
            <p className={styles.signupText}>
              ¿No tienes cuenta?{' '}
              <Link to="/signup" className={styles.link}>
                Regístrate
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
