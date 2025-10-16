     // ==================== BASE DE DATOS DE PRODUCTOS ====================
        const productos = [
            {
                id: 1,
                nombre: 'Netflix Premium',
                precio: 15.99,
                descripcion: 'Cuenta Netflix Premium 4K - 1 mes',
                icon: '📺',
                categoria: 'streaming',
                stock: 20
            },
            {
                id: 2,
                nombre: 'Spotify Premium',
                precio: 9.99,
                descripcion: 'Spotify Premium Individual - 1 mes',
                icon: '🎵',
                categoria: 'musica',
                stock: 15
            },
            {
                id: 3,
                nombre: 'Disney+ Premium',
                precio: 12.99,
                descripcion: 'Disney+ Premium - 1 mes',
                icon: '🏰',
                categoria: 'streaming',
                stock: 25
            },
            {
                id: 4,
                nombre: 'HBO Max',
                precio: 14.99,
                descripcion: 'HBO Max Premium - 1 mes',
                icon: '🎬',
                categoria: 'streaming',
                stock: 18
            },
            {
                id: 5,
                nombre: 'Amazon Prime',
                precio: 8.99,
                descripcion: 'Amazon Prime Video - 1 mes',
                icon: '📦',
                categoria: 'streaming',
                stock: 30
            },
            {
                id: 6,
                nombre: 'YouTube Premium',
                precio: 11.99,
                descripcion: 'YouTube Premium sin anuncios - 1 mes',
                icon: '▶️',
                categoria: 'streaming',
                stock: 22
            },
            {
                id: 7,
                nombre: 'Canva Pro',
                precio: 12.99,
                descripcion: 'Canva Pro - Diseño gráfico - 1 mes',
                icon: '🎨',
                categoria: 'diseño',
                stock: 10
            },
            {
                id: 8,
                nombre: 'Microsoft 365',
                precio: 6.99,
                descripcion: 'Microsoft Office 365 - 1 mes',
                icon: '💼',
                categoria: 'productividad',
                stock: 15
            },
            {
                id: 9,
                nombre: 'Apple Music',
                precio: 10.99,
                descripcion: 'Apple Music Individual - 1 mes',
                icon: '🍎',
                categoria: 'musica',
                stock: 12
            },
            {
                id: 10,
                nombre: 'Crunchyroll Premium',
                precio: 7.99,
                descripcion: 'Crunchyroll Premium - Anime - 1 mes',
                icon: '🎌',
                categoria: 'streaming',
                stock: 20
            }
        ];

        // ==================== VARIABLES GLOBALES ====================
        let carrito = [];
        let usuarioActual = null;
        let categoriaActual = 'todas';

        // ==================== INICIALIZACIÓN ====================
        document.addEventListener('DOMContentLoaded', function() {
            cargarCarrito();
            cargarUsuario();
            cargarProductos();
            actualizarContadorCarrito();
        });

        // ==================== CARGAR PRODUCTOS ====================
        function cargarProductos() {
            const grid = document.getElementById('productos-grid');
            grid.innerHTML = '';

            let productosFiltrados = productos;

            if (categoriaActual !== 'todas') {
                productosFiltrados = productos.filter(p => p.categoria === categoriaActual);
            }

            productosFiltrados.forEach(producto => {
                const card = document.createElement('div');
                card.className = 'producto-card';
                
                card.innerHTML = `
                    <div class="producto-icon">${producto.icon}</div>
                    <h3>${producto.nombre}</h3>
                    <p>${producto.descripcion}</p>
                    <div class="producto-precio">${producto.precio.toFixed(2)}</div>
                    <button class="btn-comprar" onclick="agregarAlCarrito(${producto.id})">
                        Agregar al Carrito
                    </button>
                `;
                
                grid.appendChild(card);
            });
        }

        // ==================== FILTRAR CATEGORÍA ====================
        function filtrarCategoria(categoria) {
            categoriaActual = categoria;
            
            // Actualizar botones activos
            document.querySelectorAll('.categoria-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
            
            cargarProductos();
        }

        // ==================== CARRITO ====================
        function agregarAlCarrito(productoId) {
            const producto = productos.find(p => p.id === productoId);
            
            if (!producto) return;

            const index = carrito.findIndex(item => item.id === productoId);
            
            if (index !== -1) {
                carrito[index].cantidad++;
            } else {
                carrito.push({
                    ...producto,
                    cantidad: 1
                });
            }
            
            guardarCarrito();
            actualizarContadorCarrito();
            mostrarNotificacion('✅ Producto agregado al carrito', 'success');
        }

        function guardarCarrito() {
            localStorage.setItem('carrito', JSON.stringify(carrito));
        }

        function cargarCarrito() {
            const carritoGuardado = localStorage.getItem('carrito');
            if (carritoGuardado) {
                carrito = JSON.parse(carritoGuardado);
            }
        }

        function actualizarContadorCarrito() {
            const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
            document.getElementById('contador-carrito').textContent = total;
            document.getElementById('badge-carrito').textContent = total;
        }

        function mostrarCarrito() {
            if (carrito.length === 0) {
                mostrarNotificacion('El carrito está vacío', 'info');
                return;
            }

            let contenido = '🛒 CARRITO DE COMPRAS\n\n';
            let total = 0;

            carrito.forEach(item => {
                const subtotal = item.precio * item.cantidad;
                total += subtotal;
                contenido += `${item.icon} ${item.nombre}\n`;
                contenido += `   ${item.cantidad} x ${item.precio.toFixed(2)} = ${subtotal.toFixed(2)}\n\n`;
            });

            contenido += `━━━━━━━━━━━━━━━━━━━━\n`;
            contenido += `TOTAL: ${total.toFixed(2)}`;

            alert(contenido);
            
            const confirmar = confirm('¿Deseas proceder con la compra?');
            if (confirmar) {
                procesarCompra();
            }
        }

        function procesarCompra() {
            const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
            
            mostrarNotificacion(`✅ Compra realizada con éxito! Total: ${total.toFixed(2)}`, 'success');
            
            carrito = [];
            guardarCarrito();
            actualizarContadorCarrito();
        }

        // ==================== NOTIFICACIONES ====================
        function mostrarNotificacion(mensaje, tipo = 'info') {
            const notificacion = document.createElement('div');
            notificacion.className = `notificacion notificacion-${tipo}`;
            notificacion.textContent = mensaje;
            
            document.body.appendChild(notificacion);
            
            setTimeout(() => {
                notificacion.classList.add('mostrar');
            }, 10);
            
            setTimeout(() => {
                notificacion.classList.remove('mostrar');
                setTimeout(() => {
                    notificacion.remove();
                }, 300);
            }, 3000);
        }

        // ==================== USUARIO ====================
        function cargarUsuario() {
            const usuario = localStorage.getItem('usuarioActual');
            if (usuario) {
                usuarioActual = JSON.parse(usuario);
                document.getElementById('menu-usuario').textContent = `👤 ${usuarioActual.nombre}`;
                document.getElementById('menu-usuario').onclick = mostrarPerfil;
            }
        }

        function mostrarLogin() {
            const nombre = prompt('Ingresa tu nombre:');
            const email = prompt('Ingresa tu email:');
            
            if (nombre && email) {
                usuarioActual = { nombre, email };
                localStorage.setItem('usuarioActual', JSON.stringify(usuarioActual));
                cargarUsuario();
                mostrarNotificacion('✅ Sesión iniciada correctamente', 'success');
            }
        }

        function mostrarPerfil() {
            if (usuarioActual) {
                alert(`👤 PERFIL DE USUARIO\n\nNombre: ${usuarioActual.nombre}\nEmail: ${usuarioActual.email}`);
                
                const cerrar = confirm('¿Deseas cerrar sesión?');
                if (cerrar) {
                    localStorage.removeItem('usuarioActual');
                    usuarioActual = null;
                    document.getElementById('menu-usuario').textContent = 'Iniciar Sesión';
                    document.getElementById('menu-usuario').onclick = mostrarLogin;
                    mostrarNotificacion('Sesión cerrada', 'info');
                }
            }
        }