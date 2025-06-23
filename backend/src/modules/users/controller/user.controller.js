const userService = require('../service/user.service')

exports.login = async (req, res) => {
    const { email, password } = req.body

    const result = await userService.login(email, password)

    if (!result.success) {
        return res.status(result.code).json({ message: result.message })
    }

    return res.json(result.data)
}