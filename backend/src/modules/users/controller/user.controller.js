const { login, restaurarPassword } = require('../service/user.service')

const loginController = async (req, res) => {
    try{
        const { email, password } = req.body
        const result = await login(email, password)
        return res.json(result)
    }catch(error){
        console.log('Error en loginController: ', error.message)
        return res.status(error.statusCode || 500).json({ message: error.message })
    }
}

const restaurarPasswordController = async (req, res) =>{
    try{
        const {email, nuevaPassword, confirmarPassword } =  req.body
        const result = await restaurarPassword(email, nuevaPassword, confirmarPassword)
        return res.json(result)
    }catch(error){
        console.log('Error en restaurarPasswordController: ', error.message)
        return res.status(error.statusCode || 500).json({ message: error.message })
    }
}

module.exports = {
    login: loginController,
    restaurarPassword: restaurarPasswordController
}