const User = require('../modules/users/model/user.model');
const {hashPassword} = require("./bcrypt");

const createAdmin = async (name, lastname, email, enrollment, role, password) => {
    try {
        const foundAdmin = await User.findOne({
            where: { email: email, role: role }
        })

        if (foundAdmin) {
            console.log('El administrador ya existe');
            return;
        }

        await User.create({
            name: name,
            lastname: lastname,
            email: email,
            enrollment: enrollment,
            role: role,
            password: await hashPassword(password)
        })

        console.log('Administrador creado exitosamente');
    } catch (e) {
        console.log('Error al crear el administrador:', e.message);
    }
}

const createInitialConfig = async () => {
    await createAdmin('Admin', 'User', 'admin@gmail.com', '0000000000', 'administrador', 'Admin#123')
}

module.exports = createInitialConfig;