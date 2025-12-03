# Changelog - EcoforMarket

Todos los cambios notables del proyecto serán documentados en este archivo.

## [Unreleased]

### Agregado
- Integración completa de PostgreSQL con Docker local
- Sistema de autenticación con base de datos real
- Hash de contraseñas con bcrypt (12 rounds)
- Utilidades de base de datos (`lib/db/`)
- Scripts de testing y mantenimiento:
  - `npm run test:db` - Verificar conexión a PostgreSQL
  - `npm run test:login` - Probar sistema de login
  - `npm run fix:passwords` - Regenerar contraseñas de prueba
- Documentación de base de datos:
  - `docs/SETUP_DATABASE.md` - Guía de setup
  - `docs/DATABASE_OPTIONS.md` - Análisis de opciones
- Pool de conexiones PostgreSQL con manejo de errores
- Mapeo automático de roles (BD ↔ Frontend)

### Modificado
- Endpoints de autenticación ahora usan PostgreSQL en lugar de mocks
- Página de login actualizada con credenciales correctas
- `package.json` con nuevas dependencias (pg, bcrypt, dotenv, tsx)
- `.gitignore` agregado para proteger archivos sensibles

### Cambios Técnicos
- **Antes**: Autenticación con usuarios mock en memoria
- **Ahora**: Autenticación con PostgreSQL, contraseñas hasheadas con bcrypt
- **Base de datos**: Docker Compose para desarrollo, Neon recomendado para producción

## [2024-11-20] - Integración PostgreSQL

### Agregado
- Conexión a PostgreSQL con pool de conexiones
- Funciones de gestión de usuarios (`lib/db/users.ts`)
- Scripts de migración SQL versionados
- Seed data con usuarios y productos de prueba

### Modificado
- `/api/auth/login` - Integrado con PostgreSQL
- `/api/auth/register` - Integrado con PostgreSQL + bcrypt
- `/api/auth/me` - Obtiene datos frescos de BD

## [2024-11-19] - Sistema de Autenticación Inicial

### Agregado
- Sistema de autenticación JWT básico
- Páginas de login y registro
- Middleware de protección de rutas
- Store de autenticación con Zustand


