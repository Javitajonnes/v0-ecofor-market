# Guía de Usuarios - EcoforMarket

## Usuarios de Prueba

El sistema incluye 5 usuarios de prueba preconfigurados para facilitar el desarrollo y testing.

### Credenciales de Acceso

#### 1. Administrador
- **Email:** `admin@ecoformarket.com`
- **Contraseña:** `admin123`
- **Rol:** Admin
- **Permisos:**
  - Acceso al panel de administración (`/admin`)
  - Vista completa de stock de productos
  - Gestión de usuarios y productos

#### 2. Cliente Minorista 1
- **Email:** `cliente1@email.com`
- **Contraseña:** `cliente123`
- **Rol:** Cliente Minorista
- **Permisos:**
  - Precios estándar de retail
  - Compra de productos individuales
  - Historial de órdenes personales

#### 3. Cliente Minorista 2
- **Email:** `cliente2@email.com`
- **Contraseña:** `cliente123`
- **Rol:** Cliente Minorista
- **Permisos:**
  - Precios estándar de retail
  - Compra de productos individuales
  - Historial de órdenes personales

#### 4. Cliente Mayorista 1
- **Email:** `empresa1@email.com`
- **Contraseña:** `empresa123`
- **Rol:** Cliente Mayorista
- **Permisos:**
  - Precios mayoristas con descuentos
  - Compra en grandes cantidades
  - Información de cantidad mínima de pedido
  - Historial de órdenes empresariales

#### 5. Cliente Mayorista 2
- **Email:** `empresa2@email.com`
- **Contraseña:** `empresa123`
- **Rol:** Cliente Mayorista
- **Permisos:**
  - Precios mayoristas con descuentos
  - Compra en grandes cantidades
  - Información de cantidad mínima de pedido
  - Historial de órdenes empresariales

---

## Cómo Iniciar Sesión

1. Navega a `/login` o haz clic en "Ingresar / Cuenta" en el header
2. Ingresa el email y contraseña de cualquier usuario de prueba
3. Haz clic en "Iniciar Sesión"
4. Serás redirigido a la página principal con tu sesión activa

---

## Probar el Sistema

### Página de Test Automático

Visita `/test-login` para acceder a una interfaz de testing que:
- Prueba automáticamente todos los usuarios de prueba
- Muestra resultados en tiempo real
- Permite probar credenciales personalizadas
- Verifica la funcionalidad completa del sistema de autenticación

### Verificación Manual

1. **Login exitoso:**
   - El nombre de usuario aparece en el header
   - El rol se muestra correctamente
   - Los precios cambian según el rol

2. **Persistencia de sesión:**
   - Recarga la página
   - La sesión debe mantenerse activa
   - El usuario sigue conectado

3. **Logout:**
   - Haz clic en el botón de logout en el header
   - Deberías ser redirigido a `/login`
   - La sesión se cierra correctamente

---

## Diferencias por Rol

### Invitado (No autenticado)
\`\`\`
Precio: $10.000 (precio base)
Descuento: Ninguno
Botón: "Agregar al carrito"
\`\`\`

### Cliente Minorista
\`\`\`
Precio: $10.000 (precio retail)
Descuento: Ninguno o descuentos retail estándar
Botón: "Agregar al carrito"
\`\`\`

### Cliente Mayorista
\`\`\`
Precio: $8.500 (15% descuento)
Descuento: Badge "15% OFF"
Info adicional: "Compra mínima: 10 unidades"
Botón: "Agregar al carrito"
\`\`\`

### Administrador
\`\`\`
Precio: $10.000 (precio base)
Stock: Información completa visible
Acceso: Panel de administración
Botón: "Agregar al carrito"
\`\`\`

---

## Troubleshooting

### No puedo iniciar sesión
1. Verifica que estés usando las credenciales exactas (case-sensitive)
2. Asegúrate de que la base de datos esté conectada
3. Revisa la consola del navegador para errores
4. Intenta limpiar localStorage: `localStorage.clear()`

### La sesión no persiste
1. Verifica que las cookies estén habilitadas
2. Revisa que `localStorage` funcione correctamente
3. Asegúrate de que no estés en modo incógnito

### Los precios no cambian
1. Verifica que el usuario esté correctamente autenticado
2. Recarga la página después de iniciar sesión
3. Revisa que el rol del usuario sea correcto en el store de Zustand

---

## Crear Nuevos Usuarios

### Registro Manual

1. Ve a `/registro`
2. Completa el formulario:
   - Nombre completo
   - Email (único)
   - RUT chileno válido
   - Contraseña (mínimo 6 caracteres)
   - Tipo de usuario (Persona/Empresa)
3. El rol se asigna automáticamente:
   - Persona → `retail_client`
   - Empresa → `wholesale_client`

### Registro Directo en Base de Datos

\`\`\`sql
INSERT INTO users (
  name, email, rut, password_hash, role, 
  user_type, is_active, email_verified
) VALUES (
  'Nuevo Usuario',
  'nuevo@email.com',
  '12345678-9',
  -- Password hasheada con bcrypt
  '$2a$12$...',
  'retail_client',
  'persona',
  true,
  true
);
\`\`\`

---

## Seguridad

### Contraseñas
- Todas las contraseñas están hasheadas con bcrypt (12 rounds)
- Nunca se almacenan en texto plano
- El hash tiene 60 caracteres de longitud

### Tokens JWT
- Expiración: 7 días
- Almacenados en localStorage y cookies
- Se validan en cada petición autenticada

### Validaciones
- RUT chileno validado con algoritmo oficial
- Email verificado contra formato válido
- Contraseñas con longitud mínima

---

## Contacto

Para soporte o reportar problemas, contacta al equipo de desarrollo.
