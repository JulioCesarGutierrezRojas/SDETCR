"use client"

import React, { useState } from "react"
import { Link } from "react-router-dom"
import { validateEmail } from "../../../kernel/validations"



const PasswordRecoveryForm = () => {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")


  const handleSubmit = async (e) => {
  e.preventDefault()

  const validationMessage = validateEmail(email)
  if (validationMessage) {
    setError(validationMessage)
    return
  }

  setError("") // Limpiar errores si todo está bien
  setIsLoading(true)

  // Simular llamada a API
  setTimeout(() => {
    console.log("Solicitud de recuperación para:", email)
    setIsSubmitted(true)
    setIsLoading(false)
  }, 2000)
}


  const handleChange = (e) => {
    setEmail(e.target.value)
  }

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen">
        <div className="flex-1 bg-gradient-to-br from-[var(--color-lavanda-500)] to-[var(--color-nude-500)] flex items-center justify-center p-8">
          <h1 className="text-white text-4xl font-bold">SDETCR</h1>
        </div>
        <div className="flex-1 flex items-center justify-center bg-[var(--white)] p-6">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[var(--primary)] mb-2">¡Correo enviado!</h2>
              <p className="text-[var(--color-gris-800)] mb-4">
                Hemos enviado las instrucciones para restablecer tu contraseña a:
              </p>
              <p className="font-semibold text-[var(--primary)] mb-6">{email}</p>
              <p className="text-sm text-[var(--color-gris-800)]">
                Revisa tu bandeja de entrada y sigue las instrucciones del correo.
              </p>
            </div>
            <Link
              to="/"
              className="inline-block w-full p-3 bg-[var(--primary)] text-white font-bold rounded-lg hover:bg-[var(--color-lavanda-800)] transition text-center"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 bg-gradient-to-br from-[var(--color-lavanda-500)] to-[var(--color-nude-500)] flex items-center justify-center p-8">
        <h1 className="text-white text-4xl font-bold"> LOGO DE SDETCR</h1>
        
      </div>
      <div className="flex-1 flex items-center justify-center bg-[var(--white)] p-6">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold text-[var(--primary)] mb-2">Recuperar contraseña</h2>
          <p className="text-[var(--color-gris-800)] mb-6 text-sm">
            Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.
          </p>

          <div className="mb-6">
            <label className="block font-semibold text-[var(--primary)] mb-1">Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              className="w-full p-2 border-2 border-[var(--blue)] rounded-lg bg-[var(--color-nude-200)] focus:outline-none focus:border-[var(--primary)]"
              placeholder="correo@ejemplo.com"
              required
            />
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-3 p-3 bg-[var(--primary)] text-white font-bold rounded-lg hover:bg-[var(--color-lavanda-800)] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Enviando...
              </span>
            ) : (
              "Enviar instrucciones"
            )}
          </button>

          <div className="text-center mt-6">
            <Link to="/" className="text-[var(--primary)] font-semibold hover:text-[var(--color-lavanda-900)] text-sm">
              ← Volver al inicio de sesión
            </Link>
          </div>

          <p className="text-center text-[var(--color-gris-800)] mt-4 text-sm">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-[var(--primary)] font-semibold hover:text-[var(--color-lavanda-900)]">
              Regístrate aquí
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default PasswordRecoveryForm
