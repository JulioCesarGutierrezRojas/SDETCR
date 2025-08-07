//src/kernel/validation.js

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

// Función para validar que el archivo sea de tipo video
export function isValidVideoFile(file) {
  if (!file || !file.type) return false;
  
  // Tipos MIME de video válidos
  const validVideoTypes = [
    'video/mp4',
    'video/avi',
    'video/mov',
    'video/quicktime',
    'video/wmv',
    'video/flv',
    'video/webm',
    'video/mkv',
    'video/3gp',
    'video/m4v',
    'video/mpg',
    'video/mpeg',
    'video/ogv'
  ];
  
  return validVideoTypes.includes(file.type.toLowerCase());
}

// Función para obtener el tamaño del archivo en MB
export function getFileSizeInMB(file) {
  return file ? (file.size / (1024 * 1024)).toFixed(2) : 0;
}

// Función para validar el tamaño del archivo de video
export function validateVideoFileSize(file, maxSizeInMB = 500) {
  if (!file) return "No se ha seleccionado ningún archivo.";
  
  const fileSizeInMB = getFileSizeInMB(file);
  
  if (fileSizeInMB > maxSizeInMB) {
    return `El archivo es demasiado grande (${fileSizeInMB}MB). El tamaño máximo permitido es ${maxSizeInMB}MB.`;
  }
  
  return "";
}

export function validateRole(role) {
  const validRoles = ['estudiantes', 'mentor', 'administrador'];
  
  if (!role || !role.trim()) {
    return "El rol es requerido.";
  }
  
  if (!validRoles.includes(role.trim())) {
    return "Debe seleccionar un rol válido.";
  }
  
  return "";
}

export function validateCategoryName(name) {
  if (!name || !name.trim()) {
    return "El nombre de la categoría es requerido.";
  }

  if (name.trim().length < 3) {
    return "El nombre debe tener al menos 3 caracteres.";
  }

  if (name.trim().length > 100) {
    return "El nombre no puede tener más de 100 caracteres.";
  }

  // Solo letras, números, espacios y algunos caracteres especiales
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s'.-]+$/;
  if (!nameRegex.test(name.trim())) {
    return "Solo se permiten letras, números, espacios y algunos caracteres especiales.";
  }

  return "";
}

export function validateCategoryDescription(description) {
  if (!description || !description.trim()) {
    return "La descripción es requerida.";
  }

  if (description.trim().length < 10) {
    return "La descripción debe tener al menos 10 caracteres.";
  }

  if (description.trim().length > 500) {
    return "La descripción no puede tener más de 500 caracteres.";
  }

  return "";
}

export function validateSimulatorName(name) {
  if (!name || !name.trim()) {
    return "El nombre del simulador es requerido.";
  }

  if (name.trim().length < 5) {
    return "El nombre debe tener al menos 5 caracteres.";
  }

  if (name.trim().length > 150) {
    return "El nombre no puede tener más de 150 caracteres.";
  }

  // Solo letras, números, espacios y algunos caracteres especiales
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s'.-]+$/;
  if (!nameRegex.test(name.trim())) {
    return "Solo se permiten letras, números, espacios y algunos caracteres especiales.";
  }

  return "";
}

export function validateQuestionText(question) {
  if (!question || !question.trim()) {
    return "El texto de la pregunta es requerido.";
  }

  if (question.trim().length < 10) {
    return "La pregunta debe tener al menos 10 caracteres.";
  }

  if (question.trim().length > 500) {
    return "La pregunta no puede tener más de 500 caracteres.";
  }

  return "";
}

export function validateAnswerOption(option) {
  if (!option || !option.trim()) {
    return "La opción de respuesta es requerida.";
  }

  if (option.trim().length < 1) {
    return "La opción debe tener al menos 1 caracter.";
  }

  if (option.trim().length > 200) {
    return "La opción no puede tener más de 200 caracteres.";
  }

  return "";
}

export function validateQuestionComplete(pregunta) {
  const errors = {};
  
  // Validar texto de la pregunta
  const questionError = validateQuestionText(pregunta.texto);
  if (questionError) errors.texto = questionError;

  // Validar que tenga al menos 2 respuestas
  if (!pregunta.respuestas || pregunta.respuestas.length < 2) {
    errors.respuestas = "Debe tener al menos 2 opciones de respuesta.";
    return errors;
  }

  // Validar que tenga máximo 4 respuestas
  if (pregunta.respuestas.length > 4) {
    errors.respuestas = "No puede tener más de 4 opciones de respuesta.";
    return errors;
  }

  // Validar cada respuesta
  let hasValidAnswers = true;
  pregunta.respuestas.forEach((resp, index) => {
    const respError = validateAnswerOption(resp);
    if (respError) {
      errors[`respuesta_${index}`] = respError;
      hasValidAnswers = false;
    }
  });

  // Validar que tenga una respuesta correcta seleccionada
  if (pregunta.correcta === undefined || pregunta.correcta === null || pregunta.correcta < 0) {
    errors.correcta = "Debe seleccionar una respuesta correcta.";
  } else if (pregunta.correcta >= pregunta.respuestas.length) {
    errors.correcta = "La respuesta correcta seleccionada no es válida.";
  }

  // Validar que no haya respuestas duplicadas
  if (hasValidAnswers) {
    const respuestasLimpias = pregunta.respuestas.map(r => r.trim().toLowerCase());
    const respuestasUnicas = [...new Set(respuestasLimpias)];
    if (respuestasLimpias.length !== respuestasUnicas.length) {
      errors.respuestas = "No puede haber opciones de respuesta duplicadas.";
    }
  }

  return errors;
}

export function validateAllQuestions(preguntas) {
  const errors = {};

  if (!preguntas || preguntas.length === 0) {
    return { general: "Debe agregar al menos una pregunta." };
  }

  if (preguntas.length !== 10) {
    return { general: "Debe agregar exactamente 10 preguntas." };
  }

  preguntas.forEach((pregunta, index) => {
    const preguntaErrors = validateQuestionComplete(pregunta);
    if (Object.keys(preguntaErrors).length > 0) {
      errors[`pregunta_${index}`] = preguntaErrors;
    }
  });

  return errors;
}

