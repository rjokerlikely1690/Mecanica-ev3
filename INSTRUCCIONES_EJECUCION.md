# Instrucciones de Ejecución - Sistema AutoMax

## 🚀 Inicio Rápido

### Paso 1: Iniciar MongoDB

**Asegúrate de que MongoDB esté corriendo:**

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongodb

# Windows: Iniciar desde Servicios de Windows
```

### Paso 2: Iniciar el Backend

```bash
cd backend
mvn spring-boot:run
```

El backend estará disponible en: `http://localhost:8080`

**Verificar que funciona:**
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- MongoDB: Verificar conexión en `localhost:27017`

### Paso 3: Iniciar el Frontend

En una nueva terminal:

```bash
cd frontend-simple
npm install  # Solo la primera vez
npm start
```

El frontend estará disponible en: `http://localhost:3000`

### Paso 4: Probar el Sistema

1. Abrir `http://localhost:3000` en el navegador
2. Hacer clic en "Registrarse" o usar un usuario de prueba:
   - **Admin:** `admin@automax.cl` / `admin123`
   - **Cliente:** `cliente@test.cl` / `cliente123`
3. Iniciar sesión
4. Probar las funcionalidades según el rol

---

## 📋 Requisitos Previos

### Backend
- Java 17 o superior
- Maven 3.6+

Verificar instalación:
```bash
java -version
mvn -version
```

### Frontend
- Node.js 18+ y npm

Verificar instalación:
```bash
node -version
npm -version
```

---

## 🔧 Solución de Problemas

### MongoDB no está corriendo

**Error: Cannot connect to MongoDB**
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongodb

# Verificar
mongosh
```

### Backend no inicia

**Error: Puerto 8080 en uso**
```bash
# macOS/Linux
lsof -ti:8080 | xargs kill -9

# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

**Error: Java no encontrado**
- Instalar Java 17 desde: https://adoptium.net/
- Verificar JAVA_HOME en variables de entorno

### Frontend no inicia

**Error: Puerto 3000 en uso**
```bash
# Usar puerto alternativo
PORT=3001 npm start
```

**Error: node_modules corrupto**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Frontend no se conecta al backend

1. Verificar que el backend esté corriendo en `http://localhost:8080`
2. Verificar CORS en `SecurityConfig.java`
3. Revisar la consola del navegador (F12) para errores

### Error de autenticación

1. Verificar que el token esté en localStorage (F12 → Application → Local Storage)
2. Hacer logout y login nuevamente
3. Verificar que el token no haya expirado (24 horas)

---

## 📝 Notas Importantes

- **MongoDB debe estar corriendo** antes de iniciar el backend
- El backend usa MongoDB, los datos persisten en disco
- Los usuarios de prueba se crean automáticamente al iniciar el backend
- La sesión persiste en localStorage del navegador
- Swagger está disponible para probar la API directamente
- Ver `backend/README_MONGODB.md` para configuración de MongoDB

---

## 🎯 Próximos Pasos

1. Revisar la documentación en `README_PROYECTO_SIMPLE.md`
2. Consultar el `MANUAL_USUARIO.md` para uso del sistema
3. Revisar `DOCUMENTO_INTEGRACION.md` para detalles técnicos

---

**¡Listo para presentar!** 🎉

