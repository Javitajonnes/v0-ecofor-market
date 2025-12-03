# Sistema de Autenticación - EcoforMarket

## Descripción General

Sistema completo de autenticación JWT para EcoforMarket con gestión de sesiones, roles de usuario y protección de rutas.

## Características

### Autenticación
- Login con email y contraseña
- Registro de nuevos usuarios (Minorista/Mayorista)
- Logout con limpieza de sesión
- Tokens JWT con expiración de 7 días
- Cookies HTTP-only seguras

### Roles de Usuario
- **Guest (Invitado)**: Navegación sin cuenta
- **Retail (Minorista)**: Precios regulares
- **Wholesale (Mayorista)**: Precios con descuento
- **Admin (Administrador)**: Acceso completo al sistema

### Protección de Rutas
- Middleware para rutas protegidas
- Verificación automática de roles
- Redirección a login si no autenticado
- Panel admin solo para administradores

## Rutas

### Públicas
- `/` - Página principal (acceso libre)
- `/login` - Iniciar sesión
- `/registro` - Crear cuenta nueva

### Protegidas
- `/admin` - Panel de administración (solo admin)
- `/perfil` - Perfil de usuario (autenticado)
- `/pedidos` - Historial de pedidos (autenticado)

## API Endpoints

### POST /api/auth/login
Iniciar sesión con credenciales.

**Request Body:**
\`\`\`json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
\`\`\`

**Response:**
\`\`\`json
{
  "user": {
    "id": "1",
    "name": "Juan Pérez",
    "email": "usuario@ejemplo.com",
    "role": "retail"
  }
}
\`\`\`

### POST /api/auth/register
Registrar nuevo usuario.

**Request Body:**
\`\`\`json
{
  "name": "Juan Pérez",
  "email": "usuario@ejemplo.com",
  "password": "contraseña123",
  "role": "retail"
}
\`\`\`

### POST /api/auth/logout
Cerrar sesión y eliminar token.

### GET /api/auth/me
Obtener información del usuario autenticado.

**Response:**
\`\`\`json
{
  "user": {
    "id": "1",
    "email": "usuario@ejemplo.com",
    "role": "retail"
  }
}
\`\`\`

## Usuarios de Prueba

Para testing, usa estas credenciales:

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@ecofor.com | admin123 |
| Minorista | retail@ecofor.com | retail123 |
| Mayorista | wholesale@ecofor.com | wholesale123 |

## Componentes

### AuthProvider
Componente que envuelve la aplicación y mantiene el estado de autenticación.

**Ubicación:** `components/auth-provider.tsx`

**Funcionalidad:**
- Verifica sesión al cargar la página
- Restaura usuario desde token
- Muestra loading state durante verificación

### Header con Auth
Header actualizado con menú de usuario autenticado.

**Características:**
- Muestra nombre de usuario si está autenticado
- Opción de cerrar sesión
- Enlaces a perfil y pedidos
- Selector de rol para demo (solo invitados)

## Flujo de Autenticación

### Login
1. Usuario ingresa credenciales en `/login`
2. POST a `/api/auth/login` valida usuario
3. Se genera JWT y se guarda en cookie
4. Usuario se redirige según rol (admin → `/admin`, otros → `/`)

### Registro
1. Usuario completa formulario en `/registro`
2. POST a `/api/auth/register` crea cuenta
3. Se genera JWT automáticamente
4. Usuario redirigido a página principal

### Verificación de Sesión
1. AuthProvider verifica token al cargar
2. GET a `/api/auth/me` valida token
3. Si válido, restaura sesión
4. Si inválido, limpia estado

### Protección de Rutas
1. Middleware intercepta requests
2. Verifica token en cookie
3. Valida rol para rutas admin
4. Redirige si no autorizado

## Seguridad

### Actual (Development)
- JWT con secret configurable
- Cookies HTTP-only
- Validación de roles
- Contraseñas en texto plano (SOLO DEMO)

### Producción (TODO)
- [ ] Integrar con PostgreSQL
- [ ] Hash de contraseñas con bcrypt
- [ ] Refresh tokens
- [ ] Rate limiting en login
- [ ] 2FA opcional
- [ ] Recuperación de contraseña
- [ ] Variables de entorno seguras
- [ ] HTTPS obligatorio

## Integración con Store (Zustand)

El store global mantiene el estado de autenticación:

\`\`\`typescript
interface StoreState {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
  // ... otros estados
}
\`\`\`

**Persistencia:**
- Se usa `zustand/persist` para guardar en localStorage
- El token JWT se guarda en cookie HTTP-only
- Al logout se limpia todo el estado

## Variables de Entorno

\`\`\`env
# JWT Secret (cambiar en producción)
JWT_SECRET=ecofor-market-secret-key-change-in-production

# Database (para producción)
DATABASE_URL=postgresql://user:password@localhost:5432/ecoformarket
\`\`\`

## Próximos Pasos

### Base de Datos
Implementar tabla `users` en PostgreSQL:

\`\`\`sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'retail', 'wholesale')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

### Funcionalidades Adicionales
- Recuperación de contraseña por email
- Verificación de email
- Cambio de contraseña
- Edición de perfil
- Historial de pedidos por usuario
- Favoritos/Wishlist

## Troubleshooting

### "No autenticado" después de login
- Verificar que las cookies estén habilitadas
- Revisar que JWT_SECRET sea consistente
- Comprobar que el token no haya expirado

### Redirect loop en rutas protegidas
- Verificar configuración del middleware
- Asegurar que las rutas públicas estén en la lista
- Revisar que el token sea válido

### Usuario no se mantiene al recargar
- Verificar que AuthProvider esté en layout.tsx
- Comprobar persistencia de Zustand
- Revisar que la cookie no haya expirado
