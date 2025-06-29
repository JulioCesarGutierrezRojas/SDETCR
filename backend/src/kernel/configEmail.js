
const nodemailer = require('nodemailer')

const configSendEmail = async (mailOptions) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EHOST,
        port: process.env.EPORT,
        secure: false,
        auth: {
            user: process.env.EUSER,
            pass: process.env.EPASS
        },
        connectionTimeout: 60000,
        socketTimeout: 60000
    })

    return await transporter.sendMail(mailOptions)
}

const sendEmail = async (user, code) => {
    const mailOptions = {
        from: process.env.EUSER,
        to: user.email,
        subject: 'Recuperar contraseña',
        html: `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Recuperar contraseña</title>
                    <style>
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            background-color: #f4f6f8;
                            margin: 0;
                            padding: 0;
                        }
                        .email-container {
                            max-width: 600px;
                            margin: 30px auto;
                            background-color: #ffffff;
                            padding: 30px;
                            border-radius: 10px;
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            text-align: center;
                            font-size: 26px;
                            font-weight: 600;
                            color: #2c3e50;
                            margin-bottom: 25px;
                        }
                        .code-block {
                            text-align: center;
                            font-size: 22px;
                            font-weight: bold;
                            background-color: #ecf3ff;
                            padding: 15px;
                            border-radius: 6px;
                            color: #1a73e8;
                            margin: 20px 0;
                            letter-spacing: 1px;
                        }
                        .info-list {
                            list-style: none;
                            padding: 0;
                            margin: 20px 0 0 0;
                        }
                        .info-list li {
                            background-color: #fafafa;
                            padding: 12px 16px;
                            border-bottom: 1px solid #e0e0e0;
                            color: #555;
                        }
                        .info-list li strong {
                            color: #333;
                        }
                        .info-list li:last-child {
                            border-bottom: none;
                        }
                        .footer {
                            text-align: center;
                            font-size: 13px;
                            color: #999999;
                            margin-top: 30px;
                        }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                        <div class="header">Recuperar contraseña</div>
                        <p style="text-align:center;">Utiliza el siguiente código para restablecer tu contraseña:</p>
                        <div class="code-block">${code}</div>
                        <ul class="info-list">
                            <li><strong>Nombre:</strong> ${user.name}</li>
                            <li><strong>Fecha de solicitud:</strong> ${new Date().toLocaleDateString()}</li>
                        </ul>
                        <div class="footer">
                            Este correo es automático. Por favor, no respondas a este mensaje.
                        </div>
                    </div>
                </body>
            </html>
        `
    }

    await configSendEmail(mailOptions)
}


module.exports = {
    sendEmail
}