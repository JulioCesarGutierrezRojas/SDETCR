import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        correo: '',
        rol: 'estudiante',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Datos del formulario:', formData);
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
                            className="w-full p-2 border-2 border-[var(--blue)] rounded-lg bg-[var(--color-nude-200)] focus:outline-none focus:border-[var(--primary)]"
                            placeholder="Ingresa tu nombre"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold text-[var(--primary)] mb-1">Apellido</label>
                        <input
                            type="text"
                            name="apellido"
                            value={formData.apellido}
                            onChange={handleChange}
                            className="w-full p-2 border-2 border-[var(--blue)] rounded-lg bg-[var(--color-nude-200)] focus:outline-none focus:border-[var(--primary)]"
                            placeholder="Ingresa tu apellido"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold text-[var(--primary)] mb-1">Correo</label>
                        <input
                            type="email"
                            name="correo"
                            value={formData.correo}
                            onChange={handleChange}
                            className="w-full p-2 border-2 border-[var(--blue)] rounded-lg bg-[var(--color-nude-200)] focus:outline-none focus:border-[var(--primary)]"
                            placeholder="correo@ejemplo.com"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold text-[var(--primary)] mb-1">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-2 border-2 border-[var(--blue)] rounded-lg bg-[var(--color-nude-200)] focus:outline-none focus:border-[var(--primary)]"
                            placeholder="Ingresa tu contraseña"
                            required
                        />
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

                    <button type="submit" className="w-full mt-3 p-3 bg-[var(--primary)] text-white font-bold rounded-lg hover:bg-[var(--color-lavanda-800)] transition">
                        Registrarse
                    </button>

                    <p className="text-center text-[var(--color-gris-800)] mt-4">
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