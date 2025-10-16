// ==================== BASE DE DATOS SIMULADA ====================
let usuarios = [
    {
        id: 1,
        nombre: 'Admin',
        email: 'admin@cuentaspremium.com',
        password: 'admin123',
        rol: 'admin'
    },
    {
        id: 2,
        nombre: 'Usuario Demo',
        email: 'demo@ejemplo.com',
        password: 'demo123',
        rol: 'usuario'
    }
];

// Cargar usuarios del localStorage si existen
const usuariosGuardados = localStorage.getItem('usuarios');
if (usuariosGuardados) {
    usuarios = JSON.parse(usuariosGuardados);
} else {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

// ==================== CAMBIAR TABS ====================
function cambiarTab(tab) {
    // Actualizar tabs activas
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');

    // Mostrar formulario correspondiente
    document.querySelectorAll('.form-section').forEach(f => f.classList.remove('active'));
    document.getElementById(`${tab}-form`).classList.add('active');

    // Limpiar alertas
    ocultarAlerta();
}

// ==================== TOGGLE PASSWORD ====================
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = event.target;

    if (input.type === 'password') {
        input.type = 'text';
        icon.textContent = '🙈';
    } else {
        input.type = 'password';
        icon.textContent = '👁️';
    }
}

// ==================== FORTALEZA DE CONTRASEÑA ====================
function verificarFortalezaPassword() {
    const password = document.getElementById('registro-password').value;
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-text');
    const strengthContainer = document.getElementById('password-strength');

    if (password.length === 0) {
        strengthContainer.classList.remove('show');
        strengthText.classList.remove('show');
        return;
    }

    strengthContainer.classList.add('show');
    strengthText.classList.add('show');

    let strength = 0;
    
    // Criterios de fortaleza
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    // Actualizar barra
    strengthBar.className = 'strength-bar';
    
    if (strength <= 2) {
        strengthBar.classList.add('strength-weak');
        strengthText.textContent = '⚠️ Contraseña débil';
        strengthText.style.color = '#ef4444';
    } else if (strength <= 4) {
        strengthBar.classList.add('strength-medium');
        strengthText.textContent = '✓ Contraseña media';
        strengthText.style.color = '#f59e0b';
    } else {
        strengthBar.classList.add('strength-strong');
        strengthText.textContent = '✓✓ Contraseña fuerte';
        strengthText.style.color = '#10b981';
    }
}

// ==================== INICIAR SESIÓN ====================
function iniciarSesion(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const recordarme = document.getElementById('remember-me').checked;

    // Limpiar errores previos
    limpiarErrores('login');

    // Validar campos
    if (!validarEmail(email)) {
        mostrarError('login-email', 'Email inválido');
        return;
    }

    if (password.length < 6) {
        mostrarError('login-password', 'La contraseña debe tener al menos 6 caracteres');
        return;
    }

    // Buscar usuario
    const usuario = usuarios.find(u => u.email === email && u.password === password);

    if (usuario) {
        // Login exitoso
        const usuarioSesion = {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol
        };

        // Guardar sesión
        localStorage.setItem('usuarioActual', JSON.stringify(usuarioSesion));

        // Recordar usuario si está marcado
        if (recordarme) {
            localStorage.setItem('recordarUsuario', email);
        }

        mostrarAlerta('✅ ¡Inicio de sesión exitoso! Redirigiendo...', 'success');

        // Redirigir después de 1.5 segundos
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } else {
        mostrarAlerta('❌ Email o contraseña incorrectos', 'error');
    }
}

// ==================== REGISTRAR USUARIO ====================
function registrarUsuario(event) {
    event.preventDefault();

    const nombre = document.getElementById('registro-nombre').value.trim();
    const email = document.getElementById('registro-email').value.trim();
    const password = document.getElementById('registro-password').value;
    const confirmar = document.getElementById('registro-confirmar').value;
    const aceptoTerminos = document.getElementById('acepto-terminos').checked;

    // Limpiar errores previos
    limpiarErrores('registro');

    // Validaciones
    if (nombre.length < 3) {
        mostrarError('registro-nombre', 'El nombre debe tener al menos 3 caracteres');
        return;
    }

    if (!validarEmail(email)) {
        mostrarError('registro-email', 'Email inválido');
        return;
    }

    // Verificar si el email ya existe
    const emailExiste = usuarios.find(u => u.email === email);
    if (emailExiste) {
        mostrarError('registro-email', 'Este email ya está registrado');
        return;
    }

    if (password.length < 6) {
        mostrarError('registro-password', 'La contraseña debe tener al menos 6 caracteres');
        return;
    }

    if (password !== confirmar) {
        mostrarError('registro-confirmar', 'Las contraseñas no coinciden');
        return;
    }

    if (!aceptoTerminos) {
        mostrarAlerta('❌ Debes aceptar los términos y condiciones', 'error');
        return;
    }

    // Crear nuevo usuario
    const nuevoUsuario = {
        id: Date.now(),
        nombre: nombre,
        email: email,
        password: password,
        rol: 'usuario'
    };

    // Agregar a la lista de usuarios
    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    // Auto login
    const usuarioSesion = {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol
    };

    localStorage.setItem('usuarioActual', JSON.stringify(usuarioSesion));

    mostrarAlerta('✅ ¡Cuenta creada exitosamente! Redirigiendo...', 'success');

    // Redirigir después de 1.5 segundos
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// ==================== VALIDACIONES ====================
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function mostrarError(inputId, mensaje) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(`${inputId}-error`);

    input.classList.add('error');
    error.textContent = mensaje;
    error.classList.add('show');
}

function limpiarErrores(formulario) {
    document.querySelectorAll(`#${formulario}-form input`).forEach(input => {
        input.classList.remove('error');
    });
    document.querySelectorAll(`#${formulario}-form .error-message`).forEach(error => {
        error.classList.remove('show');
        error.textContent = '';
    });
}

// ==================== ALERTAS ====================
function mostrarAlerta(mensaje, tipo) {
    const alert = document.getElementById('alert');
    alert.className = `alert alert-${tipo} show`;
    alert.textContent = mensaje;

    setTimeout(() => {
        ocultarAlerta();
    }, 5000);
}

function ocultarAlerta() {
    const alert = document.getElementById('alert');
    alert.classList.remove('show');
}

// ==================== LOGIN SOCIAL ====================
function loginGoogle() {
    mostrarAlerta('🔷 Login con Google en desarrollo...', 'success');
    // Aquí integrarías Google OAuth
}

function loginFacebook() {
    mostrarAlerta('📘 Login con Facebook en desarrollo...', 'success');
    // Aquí integrarías Facebook Login
}

// ==================== RECUPERAR CONTRASEÑA ====================
function recuperarPassword(event) {
    event.preventDefault();
    const email = prompt('Ingresa tu email para recuperar tu contraseña:');
    
    if (email && validarEmail(email)) {
        const usuario = usuarios.find(u => u.email === email);
        if (usuario) {
            mostrarAlerta(`✅ Se ha enviado un email a ${email} con instrucciones`, 'success');
            // Aquí enviarías un email real con un servicio como SendGrid
        } else {
            mostrarAlerta('❌ Email no encontrado', 'error');
        }
    } else if (email) {
        mostrarAlerta('❌ Email inválido', 'error');
    }
}

// ==================== AL CARGAR LA PÁGINA ====================
window.onload = function() {
    // Auto-completar email si está recordado
    const emailRecordado = localStorage.getItem('recordarUsuario');
    if (emailRecordado) {
        document.getElementById('login-email').value = emailRecordado;
        document.getElementById('remember-me').checked = true;
    }

    // Si ya hay sesión activa, ofrecer continuar
    const usuarioActual = localStorage.getItem('usuarioActual');
    if (usuarioActual) {
        const usuario = JSON.parse(usuarioActual);
        const confirmar = confirm(`Ya tienes una sesión activa como ${usuario.nombre}.\n¿Deseas continuar con tu sesión?`);
        if (confirmar) {
            window.location.href = 'index.html';
        } else {
            // Cerrar sesión actual
            localStorage.removeItem('usuarioActual');
        }
    }
};