import { handleRequest } from "../../../config/http-client.gateway.js";

export const login = async (email, password) => {
    try {
        const response = await handleRequest('post', '/users/login', {email, password})
        
        // Verificar si la respuesta es exitosa
        if (response.type === 'SUCCESS' && response.result) {
            const { token, user } = response.result;
            localStorage.setItem('token', token)
            localStorage.setItem('user', user.name)
            localStorage.setItem('role', user.role)
            localStorage.setItem('email', user.email)
            localStorage.setItem('userId', user.id);
            return response
        } else {
            let errorMessage = response.text || 'Error al iniciar sesión';
            
            // Personalizar mensajes de error según el contenido
            if (errorMessage.includes('Usuario no encontrado')) {
                errorMessage = 'El email ingresado no está registrado en el sistema';
            } else if (errorMessage.includes('Credenciales invalidas')) {
                errorMessage = 'La contraseña ingresada es incorrecta';
            } else if (errorMessage.includes('Email y contraseña son requeridos')) {
                errorMessage = 'Por favor, completa todos los campos';
            }
            
            throw new Error(errorMessage)
        }
    } catch (e) {
        // Si es un error de red u otro tipo, manejarlo apropiadamente
        throw new Error(e.message || 'Error de conexión. Verifica tu conexión a internet e inténtalo nuevamente.')
    } 
}

export const sendPasswordRecoveryEmail = async (email) => {
    try {
        const response = await handleRequest('post', '/users/send-email', { email })

        if (response.type !== 'SUCCESS' || response.status === 'ERROR')
            throw new Error(response.text)

        return response
    } catch (e) {
        throw new Error(e.message)
    }
}

export const validateRecoveryToken = async (token) => {
    try {
        const response = await handleRequest('post', '/users/validate-recovery-token', { token })

        if (response.type !== 'SUCCESS' || response.status === 'ERROR')
            throw new Error(response.text)

        return response
    } catch (e) {
        throw new Error(e.message)
    }
}

export const resetPassword = async (email, nuevaPassword, confirmarPassword) => {
    try {
        const response = await handleRequest('post', '/users/restaurar-password', {
            email,
            nuevaPassword,
            confirmarPassword
        })

        if (response.type !== 'SUCCESS' || response.status === 'ERROR')
            throw new Error(response.text)

        return response
    } catch (e) {
        throw new Error(e.message)
    }
}

export const registerStudent = async (name, lastname, email, category, enrollment, password) => {
    try {
        const response = await handleRequest('post', '/users/createStudent', {
            name,
            lastname,
            email,
            category,
            enrollment,
            password
        })

        if (response.type !== 'SUCCESS' || response.status === 'ERROR')
            throw new Error(response.text)

        return response
    } catch (e) {
        throw new Error(e.message)
    }
}

export const registerMentor = async (name, lastname, email, enrollment, password) => {
    try {
        const response = await handleRequest('post', '/users/createMentor', {
            name,
            lastname,
            email,
            enrollment,
            password
        })

        if (response.type !== 'SUCCESS' || response.status === 'ERROR')
            throw new Error(response.text)

        return response
    } catch (e) {
        throw new Error(e.message)
    }
}

export const logout = async () => {
    try {
        const response = await handleRequest('post', '/users/logout', {})

        // Nota: No lanzamos error si falla el logout del servidor,
        // ya que siempre queremos limpiar el estado local
        return response
    } catch (e) {
        // Retornamos un objeto válido para que continúe el logout local
        return { type: 'WARNING', text: 'Logout local realizado' };
    }
}

export const getCategories = async () => {
    try {
        const response = await handleRequest('get', '/categories/all')

        if (response.type !== 'SUCCESS' || response.status === 'ERROR')
            throw new Error(response.text)

        return response
    } catch (e) {
        throw new Error(e.message)
    }
}
