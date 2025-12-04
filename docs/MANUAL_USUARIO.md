# Manual de Usuario - EcoforMarket
## Plataforma de E-commerce Ecológico B2B/B2C

**Versión:** 1.0  
**Fecha:** Noviembre 2024  
**Plataforma:** EcoforMarket - Productos Sostenibles

---

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Primeros Pasos](#primeros-pasos)
3. [Registro y Autenticación](#registro-y-autenticación)
4. [Navegación por el Catálogo](#navegación-por-el-catálogo)
5. [Carrito de Compras](#carrito-de-compras)
6. [Gestión de Perfil](#gestión-de-perfil)
7. [Panel de Administración](#panel-de-administración)
8. [Preguntas Frecuentes](#preguntas-frecuentes)
9. [Solución de Problemas](#solución-de-problemas)

---

## Introducción

### ¿Qué es EcoforMarket?

EcoforMarket es una plataforma de comercio electrónico especializada en productos ecológicos y sostenibles. Ofrecemos una experiencia de compra diferenciada para clientes minoristas y mayoristas, con precios especiales según el tipo de cliente.

### Características Principales

- 🛍️ **Catálogo Completo**: Amplia variedad de productos ecológicos
- 💰 **Precios Diferenciados**: Precios especiales para clientes mayoristas
- 🛒 **Carrito Inteligente**: Gestiona tus compras fácilmente
- 🔍 **Búsqueda Avanzada**: Filtra por categoría, marca y precio
- 👤 **Perfiles Personalizados**: Diferentes tipos de cuenta según tus necesidades
- 📊 **Panel de Administración**: Para administradores del sistema

### Tipos de Usuario

El sistema reconoce tres tipos de usuarios:

1. **Cliente Minorista (Retail)**
   - Compras regulares
   - Precios estándar
   - Ideal para compradores individuales

2. **Cliente Mayorista (Wholesale)**
   - Compras en grandes cantidades
   - Precios con descuento
   - Ideal para empresas y distribuidores

3. **Administrador (Admin)**
   - Acceso completo al sistema
   - Gestión de productos y pedidos
   - Panel de control administrativo

---

## Primeros Pasos

### Acceso a la Plataforma

1. Abre tu navegador web (Chrome, Firefox, Safari, Edge)
2. Ingresa a la dirección de EcoforMarket
3. Verás la página principal con el catálogo de productos

### Requisitos del Sistema

- Navegador web actualizado
- Conexión a Internet
- JavaScript habilitado
- Cookies habilitadas (necesarias para el carrito y sesión)

### Navegación Básica

**Header (Barra Superior)**
- **Logo EcoforMarket**: Haz clic para volver a la página principal
- **Barra de Búsqueda**: Busca productos por nombre
- **Icono de Usuario**: Accede a tu perfil y opciones
- **Icono de Carrito**: Ve tus productos agregados

**Menú de Usuario (Icono de Usuario)**
- Si estás autenticado: Verás tu nombre, email y opciones de perfil
- Si no estás autenticado: Opciones para iniciar sesión o registrarte

---

## Registro y Autenticación

### Crear una Cuenta Nueva

#### Paso 1: Acceder al Registro

1. Haz clic en el **icono de usuario** (esquina superior derecha)
2. Selecciona **"Crear Cuenta"** o haz clic en **"Regístrate aquí"** desde la página de login
3. Serás redirigido a la página de registro

#### Paso 2: Completar el Formulario

El formulario de registro incluye los siguientes campos:

**Información Requerida:**
- **Nombre Completo**: Tu nombre y apellido
- **Correo Electrónico**: Email válido (será tu usuario)
- **Tipo de Cliente**: 
  - **Cliente Minorista**: Para compras regulares
  - **Cliente Mayorista**: Para compras en grandes cantidades (precios especiales)
- **Contraseña**: Mínimo 6 caracteres
- **Confirmar Contraseña**: Debe coincidir con la contraseña

**Ejemplo de Registro:**
```
Nombre Completo: Juan Pérez
Correo Electrónico: juan.perez@email.com
Tipo de Cliente: Cliente Minorista
Contraseña: ********
Confirmar Contraseña: ********
```

#### Paso 3: Enviar el Formulario

1. Verifica que todos los campos estén completos
2. Asegúrate de que las contraseñas coincidan
3. Haz clic en el botón **"Crear Cuenta"**
4. Si hay errores, aparecerán mensajes en rojo indicando qué corregir

#### Paso 4: Confirmación

- Si el registro es exitoso, serás redirigido automáticamente a la página principal
- Tu sesión se iniciará automáticamente
- Verás tu nombre en el header indicando que estás autenticado

**⚠️ Nota:** Si el email ya está registrado, recibirás un mensaje de error. Usa otro email o intenta iniciar sesión.

### Iniciar Sesión

#### Paso 1: Acceder al Login

1. Haz clic en el **icono de usuario** (esquina superior derecha)
2. Selecciona **"Iniciar Sesión"**
3. Serás redirigido a la página de login

#### Paso 2: Ingresar Credenciales

El formulario de login requiere:
- **Correo Electrónico**: El email con el que te registraste
- **Contraseña**: Tu contraseña

**Ejemplo:**
```
Correo Electrónico: juan.perez@email.com
Contraseña: ********
```

#### Paso 3: Iniciar Sesión

1. Ingresa tu email y contraseña
2. Haz clic en el botón **"Iniciar Sesión"**
3. Si las credenciales son correctas, serás redirigido:
   - **Administradores**: Al panel de administración (`/admin`)
   - **Clientes**: A la página principal del catálogo

**⚠️ Mensajes de Error:**
- **"Credenciales inválidas"**: Email o contraseña incorrectos
- **"Error de conexión"**: Problema de red, intenta nuevamente

#### Usuarios de Prueba

Si estás probando el sistema, puedes usar estas credenciales:

| Rol | Email | Contraseña |
|-----|-------|------------|
| Administrador | admin@ecoformarket.com | Admin123! |
| Cliente Minorista | cliente1@email.com | Admin123! |
| Cliente Mayorista | empresa1@email.com | Admin123! |

### Cerrar Sesión

1. Haz clic en el **icono de usuario**
2. En el menú desplegable, selecciona **"Cerrar Sesión"**
3. Tu sesión se cerrará y volverás a la página principal como usuario invitado

---

## Navegación por el Catálogo

### Página Principal

La página principal muestra el catálogo completo de productos ecológicos disponibles.

**Elementos de la Página:**
- **Header**: Barra superior con logo, búsqueda, usuario y carrito
- **Filtros Laterales** (Desktop): Panel izquierdo con opciones de filtrado
- **Barra de Ordenamiento**: Dropdown para ordenar productos
- **Grid de Productos**: Muestra los productos en tarjetas

### Búsqueda de Productos

#### Búsqueda por Texto

1. Localiza la **barra de búsqueda** en el header
2. Escribe el nombre del producto que buscas
3. Presiona **Enter** o haz clic en el icono de búsqueda
4. Los resultados se filtrarán automáticamente

**Ejemplo:** Buscar "botella" mostrará todos los productos que contengan esa palabra.

#### Filtros Avanzados

Los filtros te permiten refinar tu búsqueda de múltiples formas:

**Filtros Disponibles:**
- **Categorías**: Filtra por tipo de producto (ej: "Hogar", "Personal", "Alimentación")
- **Marcas**: Filtra por marca específica
- **Rango de Precio**: Desliza para establecer precio mínimo y máximo

**Cómo Usar los Filtros (Desktop):**
1. En el panel izquierdo, verás las secciones de filtros
2. Marca las casillas de las categorías/marcas que te interesan
3. Ajusta el rango de precio con el deslizador
4. Los productos se filtrarán automáticamente
5. Haz clic en **"Limpiar Filtros"** para reiniciar

**Cómo Usar los Filtros (Móvil):**
1. Haz clic en el botón **"Filtros"** (icono de deslizadores)
2. Se abrirá un panel lateral con todos los filtros
3. Selecciona tus opciones
4. Cierra el panel para ver los resultados

### Ordenamiento de Productos

Puedes ordenar los productos de diferentes formas:

1. Localiza el **dropdown "Ordenar por"** (arriba del grid de productos)
2. Selecciona una opción:
   - **Más relevantes**: Productos destacados primero
   - **Menor precio**: Del más barato al más caro
   - **Mayor precio**: Del más caro al más barato
   - **Nombre**: Orden alfabético

### Visualización de Productos

Cada producto se muestra en una tarjeta con:

- **Imagen del Producto**: Foto principal
- **Nombre del Producto**: Título descriptivo
- **Marca**: Nombre de la marca
- **Precio**: 
  - **Cliente Minorista**: Precio retail
  - **Cliente Mayorista**: Precio wholesale (con descuento)
  - **Invitado**: Precio retail (debe iniciar sesión para ver precios mayoristas)
- **Botón "Agregar al Carrito"**: Para añadir el producto

**⚠️ Nota sobre Precios:**
- Los precios se muestran automáticamente según tu tipo de cuenta
- Los clientes mayoristas ven precios con descuento
- Debes estar autenticado para ver precios mayoristas

### Agregar Productos al Carrito

1. Navega por el catálogo y encuentra el producto que deseas
2. Haz clic en el botón **"Agregar al Carrito"** en la tarjeta del producto
3. Verás una notificación confirmando que el producto fue agregado
4. El contador del carrito (icono en el header) se actualizará con el número de productos

**Ejemplo:**
- Producto: "Botella Reutilizable de Acero"
- Precio: $15.990 (cliente minorista) o $12.990 (cliente mayorista)
- Haz clic en "Agregar al Carrito"
- Notificación: "Producto agregado al carrito"
- Contador del carrito: 1

---

## Carrito de Compras

### Acceder al Carrito

1. Haz clic en el **icono del carrito** (esquina superior derecha del header)
2. Se abrirá un panel lateral mostrando todos los productos en tu carrito

### Ver Contenido del Carrito

El panel del carrito muestra:

- **Lista de Productos**: Cada producto con:
  - Imagen en miniatura
  - Nombre y marca
  - Cantidad (con botones + y -)
  - Precio unitario
  - Precio total (cantidad × precio)
  - Botón para eliminar (X)

- **Resumen de Compra**:
  - Total de productos
  - Total a pagar
  - Nota sobre precios mayoristas (si aplica)

### Gestionar Cantidades

**Aumentar Cantidad:**
1. Haz clic en el botón **"+"** junto a la cantidad
2. La cantidad aumentará en 1
3. El precio total se actualizará automáticamente

**Disminuir Cantidad:**
1. Haz clic en el botón **"-"** junto a la cantidad
2. La cantidad disminuirá en 1
3. Si la cantidad llega a 0, el producto se eliminará del carrito

**Eliminar Producto:**
1. Haz clic en el botón **"X"** (icono de eliminar)
2. El producto se eliminará inmediatamente del carrito

### Vaciar el Carrito

1. En el panel del carrito, desplázate hasta el final
2. Haz clic en el botón **"Vaciar Carrito"**
3. Se eliminarán todos los productos del carrito
4. Verás el mensaje "Tu carrito está vacío"

### Finalizar Compra

**⚠️ Nota:** Esta funcionalidad está en desarrollo. El botón "Finalizar Compra" está presente pero aún no está conectado al sistema de pedidos.

**Cuando esté disponible:**
1. Revisa los productos en tu carrito
2. Verifica el total a pagar
3. Haz clic en el botón **"Finalizar Compra"**
4. Serás redirigido al proceso de checkout
5. Completa la información de envío y pago
6. Confirma tu pedido

### Características del Carrito

- **Persistencia**: El carrito se guarda en tu navegador, incluso si cierras la página
- **Sesión**: El carrito se mantiene mientras navegas por el sitio
- **Precios Dinámicos**: Los precios se actualizan según tu tipo de cuenta
- **Cálculo Automático**: El total se calcula automáticamente al cambiar cantidades

---

## Gestión de Perfil

### Acceder a tu Perfil

1. Haz clic en el **icono de usuario** (esquina superior derecha)
2. Si estás autenticado, verás tu nombre y email
3. Selecciona **"Mi Perfil"** (cuando esté disponible)

### Información del Perfil

Tu perfil muestra:
- **Nombre Completo**
- **Correo Electrónico**
- **Tipo de Cliente**: Minorista o Mayorista
- **Rol**: Se muestra en el header cuando estás autenticado

### Ver Mis Pedidos

**⚠️ Nota:** Esta funcionalidad está en desarrollo.

**Cuando esté disponible:**
1. Haz clic en el **icono de usuario**
2. Selecciona **"Mis Pedidos"**
3. Verás un historial de todos tus pedidos
4. Podrás ver el estado de cada pedido (pendiente, confirmado, enviado, entregado)

---

## Panel de Administración

### Acceso al Panel

**Solo para Administradores:**
1. Inicia sesión con una cuenta de administrador
2. Serás redirigido automáticamente al panel de administración (`/admin`)
3. O haz clic en el **icono de usuario** → **"Panel Admin"**

**⚠️ Importante:** Solo los usuarios con rol "Administrador" pueden acceder al panel. Si intentas acceder sin permisos, serás redirigido a la página principal.

### Dashboard Principal

El panel de administración muestra:

**Estadísticas Generales:**
- **Total Productos**: Número de productos en el catálogo
- **Total Usuarios**: Número de usuarios registrados
- **Pedidos Totales**: Número de pedidos realizados
- **Ingresos**: Total de ingresos (con porcentaje de crecimiento)

**Tarjetas de Acceso Rápido:**
- **Gestión de Productos**: Ver y agregar productos
- **Gestión de Usuarios**: Ver y crear usuarios
- **Pedidos Recientes**: Ver y gestionar pedidos

### Gestión de Productos

**⚠️ Nota:** La funcionalidad completa de gestión de productos está en desarrollo.

**Cuando esté disponible:**
1. Desde el panel, haz clic en **"Ver Todos los Productos"** o **"Agregar Nuevo Producto"**
2. Podrás:
   - Ver lista de productos
   - Agregar nuevos productos
   - Editar productos existentes
   - Eliminar productos
   - Actualizar precios y stock

### Gestión de Usuarios

**⚠️ Nota:** La funcionalidad completa de gestión de usuarios está en desarrollo.

**Cuando esté disponible:**
1. Desde el panel, haz clic en **"Ver Todos los Usuarios"** o **"Crear Usuario"**
2. Podrás:
   - Ver lista de usuarios
   - Crear nuevos usuarios
   - Editar información de usuarios
   - Cambiar roles de usuarios
   - Desactivar usuarios

### Gestión de Pedidos

**⚠️ Nota:** La funcionalidad completa de gestión de pedidos está en desarrollo.

**Cuando esté disponible:**
1. Desde el panel, haz clic en **"Ver Todos los Pedidos"**
2. Podrás:
   - Ver todos los pedidos del sistema
   - Filtrar por cliente, fecha o estado
   - Actualizar estado de pedidos
   - Ver detalles de cada pedido
   - Generar reportes

### Actividad Reciente

El panel muestra una sección de "Actividad Reciente" con:
- Nuevos pedidos recibidos
- Productos actualizados
- Nuevos usuarios registrados
- Alertas del sistema (ej: stock bajo)

---

## Preguntas Frecuentes

### ¿Cómo cambio mi tipo de cuenta de Minorista a Mayorista?

Actualmente, el tipo de cuenta se establece al momento del registro. Para cambiar tu tipo de cuenta, contacta con el administrador del sistema o el soporte técnico.

### ¿Los precios mayoristas se aplican automáticamente?

Sí. Si tienes una cuenta de Cliente Mayorista, verás automáticamente los precios con descuento en todo el catálogo. No necesitas hacer nada adicional.

### ¿Puedo comprar sin crear una cuenta?

Puedes navegar por el catálogo sin cuenta, pero:
- No verás precios mayoristas
- No podrás finalizar compras
- Tu carrito se perderá si limpias los datos del navegador

**Recomendación:** Crea una cuenta para una mejor experiencia.

### ¿Cómo recupero mi contraseña?

**⚠️ Nota:** La funcionalidad de recuperación de contraseña está en desarrollo.

Por ahora, si olvidaste tu contraseña, contacta con el administrador del sistema.

### ¿Puedo modificar mi carrito después de agregar productos?

Sí. Puedes:
- Cambiar cantidades usando los botones + y -
- Eliminar productos individuales
- Vaciar todo el carrito
- El carrito se guarda automáticamente en tu navegador

### ¿Los productos tienen garantía?

La información sobre garantías y políticas de devolución debe consultarse directamente con el administrador o en los términos y condiciones del sitio.

### ¿Cómo contacto con soporte?

Para soporte técnico o consultas:
- Revisa esta documentación
- Contacta con el administrador del sistema
- Revisa la sección de "Solución de Problemas" más abajo

---

## Solución de Problemas

### No puedo iniciar sesión

**Problema:** "Credenciales inválidas"

**Soluciones:**
1. Verifica que estés usando el email correcto
2. Asegúrate de que la contraseña sea correcta (mayúsculas/minúsculas importan)
3. Si olvidaste tu contraseña, contacta con el administrador
4. Verifica que las cookies estén habilitadas en tu navegador

### El carrito está vacío después de agregar productos

**Problema:** Los productos desaparecen del carrito

**Soluciones:**
1. Verifica que las cookies estén habilitadas
2. No uses modo incógnito (el carrito se guarda en localStorage)
3. No limpies los datos del navegador mientras navegas
4. Intenta agregar los productos nuevamente

### No veo los precios mayoristas

**Problema:** Aunque tengo cuenta mayorista, veo precios regulares

**Soluciones:**
1. Verifica que hayas iniciado sesión
2. Confirma que tu cuenta sea de tipo "Mayorista"
3. Cierra sesión y vuelve a iniciar sesión
4. Si persiste, contacta con el administrador

### La página no carga correctamente

**Problema:** La página se ve rota o no carga

**Soluciones:**
1. Refresca la página (F5 o Ctrl+R)
2. Limpia la caché del navegador
3. Verifica tu conexión a Internet
4. Prueba con otro navegador
5. Asegúrate de que JavaScript esté habilitado

### No puedo acceder al panel de administración

**Problema:** Soy redirigido a la página principal al intentar acceder

**Soluciones:**
1. Verifica que tu cuenta tenga rol de "Administrador"
2. Inicia sesión nuevamente
3. Si no eres administrador, no podrás acceder al panel
4. Contacta con el administrador del sistema para solicitar permisos

### Los filtros no funcionan

**Problema:** Los productos no se filtran correctamente

**Soluciones:**
1. Refresca la página
2. Limpia los filtros y vuelve a aplicarlos
3. Verifica que JavaScript esté habilitado
4. Prueba con otro navegador

### Error al registrarse

**Problema:** "El email ya está registrado"

**Soluciones:**
1. El email que intentas usar ya tiene una cuenta
2. Intenta iniciar sesión en lugar de registrarte
3. Usa otro email para crear una nueva cuenta
4. Si olvidaste tu contraseña, contacta con el administrador

---

## Glosario de Términos

- **Cliente Minorista (Retail)**: Cliente que compra productos para uso personal o en pequeñas cantidades. Ve precios estándar.

- **Cliente Mayorista (Wholesale)**: Cliente que compra productos en grandes cantidades. Ve precios con descuento.

- **Carrito de Compras**: Área temporal donde se guardan los productos que deseas comprar antes de finalizar la compra.

- **Checkout**: Proceso final de compra donde se completa la información de envío y pago.

- **Panel de Administración**: Área restringida para administradores donde se gestiona el sistema completo.

- **Filtros**: Herramientas que permiten refinar la búsqueda de productos según categoría, marca o precio.

- **Precio Retail**: Precio estándar para clientes minoristas.

- **Precio Wholesale**: Precio con descuento para clientes mayoristas.

---

## Información de Contacto y Soporte

### Soporte Técnico

Para problemas técnicos o consultas sobre el uso de la plataforma:
- Revisa esta documentación primero
- Contacta con el administrador del sistema
- Consulta la sección "Solución de Problemas"

### Versión del Manual

- **Versión**: 1.0
- **Fecha de Actualización**: Noviembre 2024
- **Plataforma**: EcoforMarket v1.0

### Notas Importantes

- Este manual describe las funcionalidades actuales del sistema
- Algunas características mencionadas pueden estar en desarrollo
- La plataforma se actualiza regularmente, por lo que algunas funciones pueden cambiar
- Para la información más actualizada, consulta con el administrador del sistema

---

## Apéndices

### A. Navegadores Compatibles

EcoforMarket funciona mejor en:
- **Google Chrome** (recomendado)
- **Mozilla Firefox**
- **Microsoft Edge**
- **Safari** (macOS/iOS)

**Versiones mínimas recomendadas:**
- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

### B. Requisitos del Sistema

**Mínimos:**
- Conexión a Internet estable
- Navegador web actualizado
- JavaScript habilitado
- Cookies habilitadas
- Resolución de pantalla: 1024x768 mínimo

**Recomendados:**
- Conexión de banda ancha
- Navegador actualizado a la última versión
- Resolución de pantalla: 1920x1080 o superior

### C. Atajos de Teclado

- **Ctrl + F** (Cmd + F en Mac): Buscar en la página
- **F5** (Cmd + R en Mac): Refrescar página
- **Tab**: Navegar entre campos del formulario
- **Enter**: Enviar formulario o realizar búsqueda

---

**Fin del Manual de Usuario**

*Este documento fue generado automáticamente basado en la documentación técnica del proyecto EcoforMarket. Para actualizaciones o correcciones, contacta con el equipo de desarrollo.*

