// src/kernel/validation.js

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!email) {
    return "El correo electrónico es obligatorio."
  }

  if (!emailRegex.test(email)) {
    return "Por favor, introduce un correo electrónico válido."
  }

  return "" // Sin errores
}

export function validatePassword(password) {
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/

  if (!password) {
    return "La contraseña es obligatoria."
  }

  if (!passwordRegex.test(password)) {
    return "La contraseña debe tener mínimo 6 caracteres en total, un número y un carácter especial."
  }

  return ""
}

export function validateName(name) {
  if (!name || !name.trim()) {
    return "Este campo es requerido."
  }

  if (name.trim().length < 2) {
    return "Debe tener al menos 2 caracteres."
  }

  if (name.trim().length > 50) {
    return "No puede tener más de 50 caracteres."
  }

  // Solo letras, espacios y algunos caracteres especiales
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'.-]+$/
  if (!nameRegex.test(name.trim())) {
    return "Solo se permiten letras, espacios y algunos caracteres especiales."
  }

  return ""
}

export function validateEnrollment(enrollment) {
  if (!enrollment || !enrollment.trim()) {
    return "La matrícula es requerida."
  }

  if (enrollment.trim().length < 5) {
    return "La matrícula debe tener al menos 5 caracteres."
  }

  if (enrollment.trim().length > 12) {
    return "La matrícula no puede tener más de 12 caracteres."
  }

  return ""
}

