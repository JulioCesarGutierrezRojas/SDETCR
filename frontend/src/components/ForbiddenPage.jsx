import ErrorPage from "./ErrorPage";

const ForbiddenPage = () => {
    return (
        <ErrorPage
            error="403"
            title="Acceso Denegado"
            message="No tienes permisos para acceder a este recurso."
        />
    );
};

export default ForbiddenPage;
