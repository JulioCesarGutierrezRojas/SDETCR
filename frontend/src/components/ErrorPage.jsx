import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ErrorPage = ({ error = "404", title = "Página no encontrada", message = "La página que buscas no existe o ha sido movida." }) => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Función para obtener la ruta del dashboard según el rol
    const getDashboardRoute = (userRole) => {
        switch (userRole?.toLowerCase()) {
            case 'estudiantes':
                return '/student';
            case 'administrador':
                return '/admin';
            case 'mentor':
                return '/teacher';
            default:
                return '/';
        }
    };

    const handleGoHome = () => {
        if (user) {
            const dashboardRoute = getDashboardRoute(user.role);
            navigate(dashboardRoute);
        } else {
            navigate('/');
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center px-4">
            <div className="max-w-lg w-full text-center">
                {/* Error Code */}
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-white opacity-20">
                        {error}
                    </h1>
                </div>

                {/* Error Content */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
                    <div className="mb-6">
                        <div className="w-20 h-20 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                            <svg
                                className="w-10 h-10 text-red-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">
                            {title}
                        </h2>
                        <p className="text-gray-300 text-lg">
                            {message}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={handleGoHome}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                            {user ? 'Ir al Dashboard' : 'Ir al Inicio'}
                        </button>
                        
                        <button
                            onClick={handleGoBack}
                            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                />
                            </svg>
                            Regresar
                        </button>
                    </div>
                </div>

                {/* Additional Info */}
                <p className="text-gray-400 text-sm mt-6">
                    Si crees que esto es un error, por favor contacta al soporte técnico.
                </p>
            </div>
        </div>
    );
};

export default ErrorPage;
