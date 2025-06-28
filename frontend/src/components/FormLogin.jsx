import React from 'react';
import { Link } from 'react-router';
import styles from '../styles/form-login.module.css';

const LoginForm = () => {
    return (
        <div className={styles.container}>
            <div className={styles.leftPanel}></div>

            <div className={styles.rightPanel}>
                <form className={styles.form}>
                    <h2 className={styles.title}>Bienvenido a SDETCR</h2>
                    <p className={styles.subtitle}>Ingresa a tu cuenta</p>

                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>Email</label>
                        <input
                            type="email"
                            id="email"
                            className={styles.input}
                            placeholder="tucorreo@ejemplo.com"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.label}>Contraseña</label>
                        <div className={styles.passwordInputGroup}>
                            <input
                                type="password"
                                id="password"
                                className={styles.input}
                                placeholder="Ingresa tu contraseña"
                                required
                            />
                            <button
                                type="button"
                                className={styles.passwordToggle}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                     viewBox="0 0 24 24" fill="none"
                                     stroke="currentColor" strokeWidth="2"
                                     strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        Iniciar Sesión
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
