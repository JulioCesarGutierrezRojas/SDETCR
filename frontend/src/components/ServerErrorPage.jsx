import ErrorPage from "./ErrorPage";

const ServerErrorPage = () => {
    return (
        <ErrorPage
            error="500"
            title="Error del Servidor"
            message="Ha ocurrido un error interno en el servidor. Por favor, inténtalo más tarde."
        />
    );
};

export default ServerErrorPage;
