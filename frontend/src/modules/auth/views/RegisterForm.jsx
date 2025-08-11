import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerStudent, registerMentor, getCategories } from '../adapters/auth.controller.js';
import { showSuccessToast, showWarningToast } from '../../../kernel/alerts.js';
import { validateEmail, validatePassword, validateName, validateEnrollment } from '../../../kernel/validations.js';
import styles from '../../../styles/form-login.module.css';

const RegisterForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        correo: '',
        matricula: '',
        rol: 'estudiante',
        password: '',
        confirmPassword: '',
        categorias: []
    });

    const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await getCategories();
            setCategoriasDisponibles(response.result || []);
        } catch (error) {
            console.error('Error al cargar categorías:', error);
            showWarningToast({ title: 'Error', text: 'No se pudieron cargar las categorías' });
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Limpiar error del campo cuando el usuario empieza a escribir
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };
    const validateForm = () => {
        const newErrors = {};

        // Validación de nombre
        const nameError = validateName(formData.nombre);
        if (nameError) {
            newErrors.nombre = nameError;
        }

        // Validación de apellido
        const lastNameError = validateName(formData.apellido);
        if (lastNameError) {
            newErrors.apellido = lastNameError;
        }

        // Validación de correo
        const emailError = validateEmail(formData.correo);
        if (emailError) {
            newErrors.correo = emailError;
        }

        // Validación de matrícula
        const enrollmentError = validateEnrollment(formData.matricula);
        if (enrollmentError) {
            newErrors.matricula = enrollmentError;
        }

        // Validación de contraseña
        const passwordError = validatePassword(formData.password);
        if (passwordError) {
            newErrors.password = passwordError;
        }

        // Verificación de contraseñas coincidentes
        if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        // Validación de selección de categorías
        if (formData.rol === 'estudiante' && formData.categorias.length === 0) {
            newErrors.categorias = 'Debes seleccionar al menos una categoría';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            let response;
            
            if (formData.rol === 'estudiante') {
                // Convertir nombres de categorías a nombres que espera el backend
                const categoryNames = formData.categorias;
                
                response = await registerStudent(
                    formData.nombre,
                    formData.apellido,
                    formData.correo,
                    categoryNames,
                    formData.matricula,
                    formData.password
                );
            } else if (formData.rol === 'maestro') {
                response = await registerMentor(
                    formData.nombre,
                    formData.apellido,
                    formData.correo,
                    formData.matricula,
                    formData.password
                );
            }

            showSuccessToast({ 
                title: 'Registro exitoso', 
                text: response.text
            });
            
            // Redirigir al login después del registro exitoso
            navigate('/');
            
        } catch (error) {
            showWarningToast({ 
                title: 'Error en registro', 
                text: error.message
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCategoriaChange = (e) => {
        const { value, checked } = e.target;
        const updatedCategorias = checked
            ? [...formData.categorias, value]
            : formData.categorias.filter((cat) => cat !== value);

        setFormData({ ...formData, categorias: updatedCategorias });
        
        // Limpiar error de categorías si se selecciona al menos una
        if (checked && errors.categorias) {
            setErrors({ ...errors, categorias: '' });
        }
    };

    return (
        <div className="flex min-h-screen">
            <div className="flex-1 bg-gradient-to-br from-[var(--color-lavanda-500)] to-[var(--color-nude-500)] flex items-center justify-center p-8">
                <h1 className="text-white text-4xl font-bold">Bienvenido a SDETCR</h1>
            </div>

            <div className='flex-1 flex items-center justify-center bg-[var(--white)] p-6'>
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
                    <h2 className="text-2xl font-bold text-[var(--primary)] mb-4">Regístrate</h2>

                    <div className="mb-4">
                        <label className="block font-semibold text-[var(--primary)] mb-1">Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className={`w-full p-2 border-2 rounded-lg bg-[var(--color-nude-200)] focus:outline-none focus:border-[var(--primary)] ${
                                errors.nombre ? 'border-red-500' : 'border-[var(--blue)]'
                            }`}
                            placeholder="Ingresa tu nombre"
                            required
                        />
                        {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold text-[var(--primary)] mb-1">Apellido</label>
                        <input
                            type="text"
                            name="apellido"
                            value={formData.apellido}
                            onChange={handleChange}
                            className={`w-full p-2 border-2 rounded-lg bg-[var(--color-nude-200)] focus:outline-none focus:border-[var(--primary)] ${
                                errors.apellido ? 'border-red-500' : 'border-[var(--blue)]'
                            }`}
                            placeholder="Ingresa tu apellido"
                            required
                        />
                        {errors.apellido && <p className="text-red-500 text-sm mt-1">{errors.apellido}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold text-[var(--primary)] mb-1">Correo</label>
                        <input
                            type="email"
                            name="correo"
                            value={formData.correo}
                            onChange={handleChange}
                            className={`w-full p-2 border-2 rounded-lg bg-[var(--color-nude-200)] focus:outline-none focus:border-[var(--primary)] ${
                                errors.correo ? 'border-red-500' : 'border-[var(--blue)]'
                            }`}
                            placeholder="correo@ejemplo.com"
                            required
                        />
                        {errors.correo && <p className="text-red-500 text-sm mt-1">{errors.correo}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold text-[var(--primary)] mb-1">Matrícula</label>
                        <input
                            type="text"
                            name="matricula"
                            value={formData.matricula}
                            onChange={handleChange}
                            className={`w-full p-2 border-2 rounded-lg bg-[var(--color-nude-200)] focus:outline-none focus:border-[var(--primary)] ${
                                errors.matricula ? 'border-red-500' : 'border-[var(--blue)]'
                            }`}
                            placeholder="Ingresa tu matrícula"
                            required
                        />
                        {errors.matricula && <p className="text-red-500 text-sm mt-1">{errors.matricula}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold text-[var(--primary)] mb-1">Contraseña</label>
                        <div className={styles.passwordInputGroup}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full p-2 border-2 rounded-lg bg-[var(--color-nude-200)] focus:outline-none focus:border-[var(--primary)] ${
                                    errors.password ? 'border-red-500' : 'border-[var(--blue)]'
                                }`}
                                placeholder="Ingresa tu contraseña"
                                required
                            />
                            <button
                                type="button"
                                className={styles.passwordToggle}
                                onClick={() => setShowPassword(!showPassword)}
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
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold text-[var(--primary)] mb-1">Confirmar Contraseña</label>
                        <div className={styles.passwordInputGroup}>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`w-full p-2 border-2 rounded-lg bg-[var(--color-nude-200)] focus:outline-none focus:border-[var(--primary)] ${
                                    errors.confirmPassword ? 'border-red-500' : 'border-[var(--blue)]'
                                }`}
                                placeholder="Confirma tu contraseña"
                                required
                            />
                            <button
                                type="button"
                                className={styles.passwordToggle}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? (
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
                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold text-[var(--primary)] mb-1">Rol</label>
                        <select
                            name="rol"
                            value={formData.rol}
                            onChange={handleChange}
                            className="w-full p-2 border-2 border-[var(--blue)] rounded-lg bg-[var(--color-nude-200)] focus:outline-none focus:border-[var(--primary)]"
                        >
                            <option value="estudiante">Estudiante</option>
                            <option value="maestro">Maestro</option>
                        </select>
                    </div>

                    {formData.rol === 'estudiante' && (
                        <div className="mb-4">
                            <label className="block font-semibold text-[var(--primary)] mb-1">
                                Selecciona tus categorías
                            </label>
                            <div className={`max-h-29 overflow-y-auto flex flex-col gap-2 bg-[var(--color-nude-200)] p-3 rounded-lg border-2 ${
                                errors.categorias ? 'border-red-500' : 'border-[var(--blue)]'
                            }`}>
                                {categoriasDisponibles.map((categoria) => (
                                    <label key={categoria.category_id || categoria.name} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            name="categorias"
                                            value={categoria.name}
                                            checked={formData.categorias?.includes(categoria.name)}
                                            onChange={handleCategoriaChange}
                                            className="accent-[var(--primary)]"
                                        />
                                        {categoria.name}
                                    </label>
                                ))}
                            </div>
                            {errors.categorias && <p className="text-red-500 text-sm mt-1">{errors.categorias}</p>}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full mt-3 p-3 bg-[var(--primary)] text-white font-bold rounded-lg hover:bg-[var(--color-lavanda-800)] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Registrando...' : 'Registrarse'}
                    </button>

                    <p className="text-center text-[var(--color-gris-800)] mt-4 text-sm">
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/" className="text-[var(--primary)] font-semibold hover:text-[var(--color-lavanda-900)]">
                            Inicia sesión
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default RegisterForm;