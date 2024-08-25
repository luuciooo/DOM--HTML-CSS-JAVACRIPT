const submitFunction = (event) => {
    if (!validarFormulario()) {
        event.preventDefault();
    } else {
        event.preventDefault();

        alert(
            'Los datos enviados fueron: \n' +
            'Nombre: ' + document.getElementById('nombre').value + '\n' +
            'Apellido: ' + document.getElementById('apellido').value + '\n' +
            'Documento: ' + document.getElementById('documento').value + '\n' +
            'Email: ' + document.getElementById('email').value + '\n' +
            'Edad: ' + document.getElementById('edad').value + '\n' +
            'Actividad: ' + document.getElementById('actividad').value + '\n' +
            'Nivel de Estudio: ' + document.getElementById('nivelEstudio').value + '\n'
        )

    }
}

document.getElementById('formulario').addEventListener('submit', submitFunction) // escucha el envío del formulario

function validarFormulario() {

    // Esto valida los campos de texto
    const camposTexto = document.querySelectorAll('input[type="text"]');
    let validacionCorrecta = true;

    camposTexto.forEach(campo => {
        let errorCampo = document.getElementById('error' + campo.id.charAt(0).toUpperCase() + campo.id.slice(1)) // error + id con la primera en mayúscula 
        if (campo.value.length < 3) {
            mostrarError(errorCampo, '¡Este campo debe tener al menos 3 caracteres!');
            validacionCorrecta = false;
        } else if (!/^[a-zA-Z\s]+$/.test(campo.value)) {
            mostrarError(errorCampo, '¡Este campo solo debe contener letras!');
            validacionCorrecta = false;
        } else {
            ocultarError(errorCampo);
        }
    })


    //Validacion Documento

    const documento = document.getElementById('documento');
    const errorDocumento = document.getElementById('errorDocumento');

    if (documento.value.length < 7 || documento.value.length > 10) {
        mostrarError(errorDocumento, '¡El documento debe tener entre 7 y 10 dígitos!');
        validacionCorrecta = false;
    } else {
        ocultarError(errorDocumento);
    }

    //esto valida el campo email
    const email = document.getElementById('email');
    let errorEmail = document.getElementById('errorEmail')

    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { // este regex valida que el formato del email se válido
        ocultarError(errorEmail)
    } else {
        mostrarError(errorEmail, '¡Ingrese un correo electrónico válido!')
    }

    //Validacion Contraseña

    const password = document.getElementById('password');
    const errorPassword = document.getElementById('errorPassword');

    if (password.value.length < 8) {
        mostrarError(errorPassword, '¡La contraseña debe tener al menos 8 caracteres!');
        validacionCorrecta = false;
    } else if (!/[A-Z]/.test(password.value) || !/[a-z]/.test(password.value) || !/[0-9]/.test(password.value)) {
        mostrarError(errorPassword, '¡La contraseña debe incluir mayúsculas, minúsculas y números!');
        validacionCorrecta = false;
    } else {
        ocultarError(errorPassword);
    }

    const confirmarPassword = document.getElementById('RePassword');
    const errorConfirmarPassword = document.getElementById('errorRePassword');

    if (password.value == '') {
        mostrarError(errorConfirmarPassword, '¡Este campo es requerido!')
        validacionCorrecta = false
    }else if (password.value !== confirmarPassword.value) {
        mostrarError(errorConfirmarPassword, '¡Las contraseñas no coinciden!');
        validacionCorrecta = false;
    } else {
        ocultarError(errorConfirmarPassword);
    }

    // Validación de edad

    const edad = document.getElementById('edad');
    const errorEdad = document.getElementById('errorEdad')

    if (edad.value < 18) {
        mostrarError(errorEdad, '¡Debes ser mayor de 18 años para registrarte!');
        validacionCorrecta = false;
    } else if (edad.value > 100) {
        mostrarError(errorEdad, '¡Por favor, ingresa una edad válida!');
        validacionCorrecta = false;
    } else {
        ocultarError(errorEdad);
    }


    // Validación de la actividad

    const actividad = document.getElementById('actividad')
    const errorActividad = document.getElementById('errorActividad')

    if (actividad.value == '') {
        mostrarError(errorActividad, 'Por favor, selecciona una actividad')
        validacionCorrecta = false;
    } else {
        ocultarError(errorActividad)
    }

    // Validación de nivel de estudio
    const nivelEstudio = document.getElementById('nivelEstudio')
    const errorNivelEstudio = document.getElementById('errorNivelEstudio')

    if (nivelEstudio.value == '') {
        mostrarError(errorNivelEstudio, 'Por favor, selecciona un nivel de estudio')
        validacionCorrecta = false;
    } else {
        ocultarError(errorNivelEstudio)
    }

    // Validar los términos y condiciones

    const aceptoTerminos = document.getElementById('aceptoTerminos')
    const errorAceptoTerminos = document.getElementById('errorAceptoTerminos')

    if (!aceptoTerminos.checked) {
        mostrarError(errorAceptoTerminos, '¡Debes aceptar los términos y condiciones!')
        validacionCorrecta = false
    } else {
        ocultarError(errorAceptoTerminos)
    }

    return validacionCorrecta // esto dirá si el formulario completo es o no válido

}

const mostrarError = (elemento, mensaje) => {
    elemento.textContent = mensaje;
    elemento.style.display = "block";
}

const ocultarError = (elemento) => {
    elemento.textContent = '';
    elemento.style.display = "none";
}