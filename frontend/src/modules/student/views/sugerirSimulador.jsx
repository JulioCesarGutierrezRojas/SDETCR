import React, { useState, useEffect } from "react";
import { FaUser} from "react-icons/fa";
import { saveSuggestion } from "../adapters/student.controller.js";
import { getStudentCategories } from "../../teacher/adapters/teacher.controller.js";
import { showConfirmation, showSuccessToast, showErrorToast, showWarningToast } from "../../../kernel/alerts.js";
import { useAuth } from "../../../context/AuthContext.jsx";

const SugerirSimulador = () => {
    const { user } = useAuth();
    const [student, setStudent] = useState({
        nombre: '',
        correo: '',
        matricula: '',
    });

    const [formData, setFormData] = useState({
        categoria: "",
        simulador: "",
        descripcion: "",
        fecha: new Date().toLocaleDateString("es-MX"),
    });

    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        const loadUserProfile = async () => {
            if (user && user.id) {
                try {
                    // Usar el mismo endpoint que usa EvaluarEstudiante.jsx
                    const response = await getStudentCategories(user.id);
                    const studentInfo = response.result.student;
                    
                    setStudent({
                        nombre: `${studentInfo.name} ${studentInfo.lastname}`,
                        correo: studentInfo.email,
                        matricula: studentInfo.enrollment
                    });
                } catch (error) {
                    // Si falla la carga del perfil, usar datos del contexto
                    console.warn('No se pudo cargar el perfil completo:', error.message);
                    setStudent({
                        nombre: user.name || 'Estudiante',
                        correo: user.email || 'estudiante@universidad.edu.mx',
                        matricula: 'N/A',
                    });
                }
            } else {
                // Valores por defecto si no hay usuario en el contexto
                setStudent({
                    nombre: 'Estudiante',
                    correo: 'estudiante@universidad.edu.mx',
                    matricula: 'N/A',
                });
            }
        };

        loadUserProfile();
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        
        // Resetear estado de enviado cuando el usuario modifica el formulario
        if (isSubmitted) {
            setIsSubmitted(false);
        }
    };

    const validateForm = () => {
        if (!formData.categoria.trim()) {
            showWarningToast({
                title: 'Campo requerido',
                text: 'Por favor ingresa el nombre de la categoría sugerida'
            });
            return false;
        }

        if (formData.categoria.trim().length < 3) {
            showWarningToast({
                title: 'Categoría muy corta',
                text: 'El nombre de la categoría debe tener al menos 3 caracteres'
            });
            return false;
        }

        if (!formData.simulador.trim()) {
            showWarningToast({
                title: 'Campo requerido',
                text: 'Por favor ingresa el nombre del simulador sugerido'
            });
            return false;
        }

        if (formData.simulador.trim().length < 5) {
            showWarningToast({
                title: 'Nombre muy corto',
                text: 'El nombre del simulador debe tener al menos 5 caracteres'
            });
            return false;
        }

        if (!formData.descripcion.trim()) {
            showWarningToast({
                title: 'Campo requerido',
                text: 'Por favor describe el tipo de preguntas o contenido sugerido'
            });
            return false;
        }

        if (formData.descripcion.trim().length < 10) {
            showWarningToast({
                title: 'Descripción muy corta',
                text: 'La descripción debe tener al menos 10 caracteres'
            });
            return false;
        }

        if (formData.descripcion.trim().length > 500) {
            showWarningToast({
                title: 'Descripción muy larga',
                text: 'La descripción no puede exceder los 500 caracteres'
            });
            return false;
        }

        return true;
    };

    const handleConfirmSubmit = async () => {
        try {
            setLoading(true);
            
            await saveSuggestion(
                formData.categoria.trim(),
                formData.simulador.trim(), 
                formData.descripcion.trim()
            );

            setIsSubmitted(true);
            
            // Limpiar formulario
            setFormData({
                categoria: "",
                simulador: "",
                descripcion: "",
                fecha: new Date().toLocaleDateString("es-MX"),
            });

            showSuccessToast({
                title: '¡Sugerencia enviada!',
                text: 'Tu sugerencia ha sido enviada correctamente y será revisada por los administradores.'
            });

        } catch (error) {
            showErrorToast({
                title: 'Error al enviar sugerencia',
                text: error.message || 'Hubo un problema al enviar tu sugerencia. Por favor intenta de nuevo.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validar formulario
        if (!validateForm()) {
            return;
        }

        // Mostrar confirmación
        showConfirmation(
            '¿Enviar sugerencia?',
            `¿Estás seguro de que quieres enviar esta sugerencia? Una vez enviada será revisada por los administradores.`,
            'question',
            handleConfirmSubmit,
            () => {
                console.log('Envío de sugerencia cancelado');
            }
        );
    };

    return (
        <div className="p-4">
            <div className="flex bg-white shadow-md rounded-xl border border-[var(--color-gris-200)] overflow-hidden mb-6">
                <div className="w-[7px] bg-[var(--color-lavanda-600)]" />
                <div className="flex items-center space-x-4 p-3">
                    <div className="bg-[var(--color-lavanda-200)] p-3 rounded-full">
                        <FaUser className="text-[var(--color-lavanda-700)] text-xl" />
                    </div>
                    <div>
                        <p className="font-semibold text-[var(--color-gris-900)]">{student.nombre}</p>
                        <p className="text-sm text-[var(--color-gris-700)]">Correo: {student.correo}</p>
                        <p className="text-sm text-[var(--color-gris-700)]">Matrícula: {student.matricula}</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-xl border border-[var(--color-gris-400)] space-y-4">
                <h2 className="text-xl font-semibold text-[var(--color-lavanda-700)] pb-2">
                    Sugerencia de Nuevo Simulador
                </h2>

                <div>
                    <label className="block mb-1 font-medium text-sm text-[var(--color-gris-900)]">
                        Nombre de la categoría sugerida
                    </label>
                    <input
                        type="text"
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleChange}
                        className="w-full border border-[var(--color-gris-500)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lavanda-500)]"
                        placeholder="Ej. Redes, Seguridad, Programación"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium text-sm text-[var(--color-gris-900)]">
                        Nombre del simulador sugerido
                    </label>
                    <input
                        type="text"
                        name="simulador"
                        value={formData.simulador}
                        onChange={handleChange}
                        className="w-full border border-[var(--color-gris-500)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lavanda-500)]"
                        placeholder="Ej. Simulador de IPs, Firewall básico"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium text-sm text-[var(--color-gris-900)]">
                        Tipo de preguntas o contenido sugerido
                        <span className="text-xs text-[var(--color-gris-600)] ml-2">({formData.descripcion.length}/500 caracteres)</span>
                    </label>
                    <textarea
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        rows={4}
                        maxLength={500}
                        className="w-full border border-[var(--color-gris-500)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lavanda-500)] resize-none"
                        placeholder="Describe el tipo de preguntas, temas o dinámicas que debería tener el simulador..."
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium text-sm text-[var(--color-gris-900)]">
                        Fecha de sugerencia
                    </label>
                    <input
                        type="text"
                        name="fecha"
                        value={formData.fecha}
                        readOnly
                        className="w-full bg-gray-100 border border-[var(--color-gris-500)] rounded-lg px-3 py-2 text-sm text-[var(--color-gris-800)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lavanda-500)]"
                    />
                </div>

                <div className="flex justify-between items-center">
                    {isSubmitted && (
                        <div className="flex items-center text-green-600 text-sm">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            ¡Sugerencia enviada exitosamente!
                        </div>
                    )}
                    
                    <div className={`${isSubmitted ? '' : 'ml-auto'}`}>
                        <button 
                            type="submit"
                            disabled={loading}
                            className={`px-5 py-2 rounded-lg font-medium transition duration-200 ${
                                loading 
                                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                                    : 'bg-[var(--color-lavanda-600)] text-[var(--color-blanco)] hover:bg-[var(--color-lavanda-800)] active:bg-[var(--color-lavanda-900)]'
                            }`}
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Enviando...
                                </div>
                            ) : (
                                'Enviar sugerencia'
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default SugerirSimulador;