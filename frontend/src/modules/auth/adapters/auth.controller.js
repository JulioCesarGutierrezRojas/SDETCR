import { handleRequest } from "../../../config/http-client.gateway.js";

export const login = async (email, password) => {
    try {
        const response = await handleRequest('post', '/users/login', {email, password})

        if (response.type !== 'SUCCESS' || response.status === 'ERROR')
            throw new Error(response.text)

        const { token, user } = response.result;
        localStorage.setItem('token', token)
        localStorage.setItem('user', user.name)
        localStorage.setItem('role', user.role)
        localStorage.setItem('email', user.email)

        return response
    } catch (e) {
        throw new Error(e.message)
    } 
}