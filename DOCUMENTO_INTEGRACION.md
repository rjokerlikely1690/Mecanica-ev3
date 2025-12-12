# Documento de Integración - Sistema AutoMax

## 📋 Índice

1. [Introducción](#introducción)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Comunicación Frontend-Backend](#comunicación-frontend-backend)
4. [Flujo de Autenticación](#flujo-de-autenticación)
5. [Flujo de Datos](#flujo-de-datos)
6. [Configuración de CORS](#configuración-de-cors)
7. [Manejo de Errores](#manejo-de-errores)
8. [Seguridad](#seguridad)
9. [Diagramas](#diagramas)

---

## 1. Introducción

Este documento describe la integración entre el frontend React y el backend Spring Boot del sistema de gestión de servicios para el taller mecánico AutoMax. La integración se realiza mediante comunicación REST API con autenticación JWT.

---

## 2. Arquitectura del Sistema

### 2.1. Componentes Principales

```
┌─────────────────┐         HTTP/REST         ┌─────────────────┐
│                 │ ◄────────────────────────► │                 │
│  Frontend React │         JWT Token          │ Backend Spring  │
│  (Puerto 3000)  │                             │  Boot (8080)    │
│                 │                             │                 │
└─────────────────┘                             └─────────────────┘
                                                         │
                                                         ▼
                                                ┌─────────────────┐
                                                │   Base de Datos │
                                                │   H2 (Memoria)  │
                                                └─────────────────┘
```

### 2.2. Stack Tecnológico

**Frontend:**
- React 18
- Axios (cliente HTTP)
- React Router DOM (navegación)
- React Bootstrap (UI)

**Backend:**
- Spring Boot 3.2.0
- Spring Security (autenticación)
- Spring Data JPA (persistencia)
- JWT (tokens)
- H2 Database

---

## 3. Comunicación Frontend-Backend

### 3.1. Configuración del Cliente HTTP

El frontend utiliza Axios como cliente HTTP, configurado en `apiService.js`:

```javascript
const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### 3.2. Interceptores Axios

#### Interceptor de Request
Agrega automáticamente el token JWT a todas las peticiones:

```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### Interceptor de Response
Maneja errores de autenticación:

```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 3.3. Servicios API

**AuthService:**
- `login(email, password)` - POST `/api/auth/login`
- `register(nombre, email, password)` - POST `/api/auth/register`

**ServicioService:**
- `getAll()` - GET `/api/servicios`
- `getById(id)` - GET `/api/servicios/{id}`
- `create(servicio)` - POST `/api/servicios`
- `update(id, servicio)` - PUT `/api/servicios/{id}`
- `delete(id)` - DELETE `/api/servicios/{id}`

---

## 4. Flujo de Autenticación

### 4.1. Registro de Usuario

```
┌──────────┐                    ┌──────────┐                    ┌──────────┐
│ Frontend │                    │ Backend  │                    │   BD     │
└────┬─────┘                    └────┬─────┘                    └────┬─────┘
     │                                │                               │
     │ 1. POST /api/auth/register     │                               │
     │───────────────────────────────>│                               │
     │                                │ 2. Validar datos             │
     │                                │──────────────────────────────>│
     │                                │ 3. Crear usuario              │
     │                                │<──────────────────────────────│
     │                                │ 4. Generar JWT                │
     │ 5. Response: {token, user}     │                               │
     │<───────────────────────────────│                               │
     │ 6. Guardar en localStorage    │                               │
     │                                │                               │
```

**Código Frontend:**
```javascript
const response = await authService.register(nombre, email, password);
const { token, ...userData } = response;
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(userData));
```

**Código Backend:**
```java
@PostMapping("/register")
public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
    AuthResponse response = authService.register(request);
    return ResponseEntity.ok(response);
}
```

### 4.2. Inicio de Sesión

```
┌──────────┐                    ┌──────────┐                    ┌──────────┐
│ Frontend │                    │ Backend  │                    │   BD     │
└────┬─────┘                    └────┬─────┘                    └────┬─────┘
     │                                │                               │
     │ 1. POST /api/auth/login       │                               │
     │───────────────────────────────>│                               │
     │                                │ 2. Validar credenciales       │
     │                                │──────────────────────────────>│
     │                                │ 3. Verificar usuario          │
     │                                │<──────────────────────────────│
     │                                │ 4. Generar JWT                │
     │ 5. Response: {token, user}     │                               │
     │<───────────────────────────────│                               │
     │ 6. Guardar en localStorage     │                               │
     │                                │                               │
```

### 4.3. Peticiones Autenticadas

```
┌──────────┐                    ┌──────────┐                    ┌──────────┐
│ Frontend │                    │ Backend  │                    │   BD     │
└────┬─────┘                    └────┬─────┘                    └────┬─────┘
     │                                │                               │
     │ 1. GET /api/servicios          │                               │
     │    Header: Authorization:     │                               │
     │    Bearer <token>              │                               │
     │───────────────────────────────>│                               │
     │                                │ 2. Validar JWT                │
     │                                │ 3. Verificar rol              │
     │                                │ 4. Consultar servicios        │
     │                                │──────────────────────────────>│
     │                                │ 5. Obtener datos              │
     │                                │<──────────────────────────────│
     │ 6. Response: [servicios]       │                               │
     │<──────────────────────────────│                               │
     │                                │                               │
```

---

## 5. Flujo de Datos

### 5.1. Crear Servicio (ADMIN)

```
Usuario → Frontend → API Service → Backend → Base de Datos
   │         │            │           │            │
   │         │            │           │            │
   │   1. Formulario      │           │            │
   │   2. Validación      │           │            │
   │   3. POST request    │           │            │
   │──────────────────────>│           │            │
   │         │     4. Agregar token  │            │
   │         │───────────────────────>│            │
   │         │            │    5. Validar JWT     │
   │         │            │    6. Verificar ADMIN │
   │         │            │    7. Validar datos   │
   │         │            │    8. Guardar         │
   │         │            │───────────────────────>│
   │         │            │           │    9. Retornar
   │         │            │<───────────────────────│
   │         │<───────────│           │            │
   │<────────│            │           │            │
   │   10. Actualizar UI │           │            │
```

### 5.2. Listar Servicios (CLIENTE)

```
Usuario → Frontend → API Service → Backend → Base de Datos
   │         │            │           │            │
   │   1. Cargar página   │           │            │
   │   2. GET request     │           │            │
   │──────────────────────>│           │            │
   │         │     3. Agregar token  │            │
   │         │───────────────────────>│            │
   │         │            │    4. Validar JWT     │
   │         │            │    5. Verificar rol    │
   │         │            │    6. Filtrar activos │
   │         │            │───────────────────────>│
   │         │            │           │    7. Retornar
   │         │            │<───────────────────────│
   │         │<───────────│           │            │
   │<────────│            │           │            │
   │   8. Mostrar cards    │           │            │
```

---

## 6. Configuración de CORS

### 6.1. Backend (Spring Security)

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(List.of("http://localhost:3000"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

### 6.2. Frontend

No requiere configuración adicional, ya que el backend permite las peticiones desde `http://localhost:3000`.

---

## 7. Manejo de Errores

### 7.1. Errores de Validación

**Backend:**
```java
@ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<Map<String, String>> handleValidationExceptions(
        MethodArgumentNotValidException ex) {
    Map<String, String> errors = new HashMap<>();
    ex.getBindingResult().getAllErrors().forEach((error) -> {
        String fieldName = ((FieldError) error).getField();
        String errorMessage = error.getDefaultMessage();
        errors.put(fieldName, errorMessage);
    });
    return ResponseEntity.badRequest().body(errors);
}
```

**Frontend:**
```javascript
try {
    const result = await servicioService.create(servicioData);
    // Éxito
} catch (error) {
    if (error.response?.data) {
        // Mostrar errores de validación
        setError(error.response.data);
    } else {
        setError('Error al guardar el servicio');
    }
}
```

### 7.2. Errores de Autenticación

- **401 Unauthorized:** Token inválido o expirado
  - El interceptor redirige automáticamente al login
  - Se limpia el localStorage

- **403 Forbidden:** Usuario sin permisos
  - Se muestra mensaje de error
  - Se redirige al dashboard

### 7.3. Errores de Red

- Timeout de peticiones
- Servidor no disponible
- Errores de conexión

Se muestran mensajes amigables al usuario.

---

## 8. Seguridad

### 8.1. Autenticación JWT

**Generación del Token:**
```java
public String generateToken(UserDetails userDetails, String rol) {
    Map<String, Object> claims = new HashMap<>();
    claims.put("rol", rol);
    return createToken(claims, userDetails.getUsername());
}
```

**Validación del Token:**
```java
public Boolean validateToken(String token, UserDetails userDetails) {
    final String username = extractUsername(token);
    return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
}
```

### 8.2. Filtro de Autenticación

```java
@Override
protected void doFilterInternal(HttpServletRequest request, 
                                HttpServletResponse response, 
                                FilterChain chain) {
    String jwt = extractToken(request);
    if (jwt != null && jwtUtil.validateToken(jwt, userDetails)) {
        // Establecer autenticación en SecurityContext
    }
    chain.doFilter(request, response);
}
```

### 8.3. Control de Acceso por Roles

**Backend:**
```java
@PreAuthorize("hasRole('ADMIN')")
@PostMapping
public ResponseEntity<Servicio> createServicio(@Valid @RequestBody ServicioRequest request) {
    // Solo ADMIN puede crear servicios
}
```

**Frontend:**
```javascript
{isAdmin() && (
    <Button onClick={handleCreate}>Crear Servicio</Button>
)}
```

### 8.4. Persistencia Segura de Sesión

- Token almacenado en `localStorage`
- Validación en cada petición
- Expiración automática (24 horas)
- Limpieza al cerrar sesión

---

## 9. Diagramas

### 9.1. Diagrama de Secuencia - Login

```
Usuario    Frontend    AuthContext    API Service    Backend    Base Datos
   │          │            │              │             │            │
   │  1. Login│            │              │             │            │
   │─────────>│            │              │             │            │
   │          │  2. login()│              │             │            │
   │          │───────────>│              │             │            │
   │          │            │  3. POST /auth/login        │            │
   │          │            │──────────────>│             │            │
   │          │            │              │  4. Validar  │            │
   │          │            │              │─────────────>│            │
   │          │            │              │             │  5. Query  │
   │          │            │              │             │───────────>│
   │          │            │              │  6. Response│<───────────│
   │          │            │              │<────────────│            │
   │          │            │  7. Token + User            │            │
   │          │            │<──────────────│             │            │
   │          │  8. Guardar en localStorage            │            │
   │          │<───────────│              │             │            │
   │  9. Redirigir a Dashboard                          │            │
   │<─────────│            │              │             │            │
```

### 9.2. Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend React                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   AuthContext│  │  API Service │  │  Components  │  │
│  │              │  │              │  │              │  │
│  │ - user       │  │ - authService│  │ - Login       │  │
│  │ - token      │  │ - servicio   │  │ - Register   │  │
│  │ - login()    │  │   Service    │  │ - Dashboard   │  │
│  │ - logout()   │  │              │  │ - Servicios  │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                  │                  │          │
└─────────┼──────────────────┼──────────────────┼──────────┘
          │                  │                  │
          │      HTTP/REST    │                  │
          │      JWT Token    │                  │
          │                  │                  │
┌─────────┼──────────────────┼──────────────────┼──────────┐
│         │                  │                  │          │
│  ┌──────▼──────┐  ┌───────▼──────┐  ┌───────▼──────┐    │
│  │  Controller │  │   Service    │  │  Repository   │    │
│  │             │  │              │  │              │    │
│  │ - AuthCtrl  │  │ - AuthService│  │ - UsuarioRepo│    │
│  │ - Servicio  │  │ - Servicio   │  │ - Servicio   │    │
│  │   Controller│  │   Service    │  │   Repository  │    │
│  └──────┬──────┘  └───────┬──────┘  └───────┬───────┘    │
│         │                  │                  │          │
│  ┌──────▼──────────────────▼──────────────────▼──────┐  │
│  │         Spring Security + JWT Filter              │  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │              Base de Datos H2                       │ │
│  └────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────┘
```

---

## 📊 Resumen de Integración

### Puntos Clave

1. **Comunicación REST:** Todas las peticiones usan HTTP/REST
2. **Autenticación JWT:** Token en cada petición autenticada
3. **CORS Configurado:** Permite peticiones desde frontend
4. **Manejo de Errores:** Interceptores y handlers globales
5. **Persistencia de Sesión:** localStorage en frontend
6. **Control de Acceso:** Roles validados en backend y frontend

### Endpoints Principales

| Endpoint | Método | Autenticación | Rol Requerido |
|----------|--------|---------------|---------------|
| `/api/auth/register` | POST | No | - |
| `/api/auth/login` | POST | No | - |
| `/api/servicios` | GET | Sí | ADMIN, CLIENTE |
| `/api/servicios` | POST | Sí | ADMIN |
| `/api/servicios/{id}` | PUT | Sí | ADMIN |
| `/api/servicios/{id}` | DELETE | Sí | ADMIN |

---

**Versión del Documento:** 1.0  
**Fecha:** Diciembre 2024  
**Sistema:** Taller Mecánico AutoMax - Evaluación Parcial 3


