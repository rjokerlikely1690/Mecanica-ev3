# Configuración MongoDB - Backend AutoMax

## 📋 Requisitos

- MongoDB instalado y corriendo
- Puerto 27017 disponible (puerto por defecto de MongoDB)

## 🚀 Instalación de MongoDB

### macOS (usando Homebrew)
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Windows
Descargar e instalar desde: https://www.mongodb.com/try/download/community

### Linux (Ubuntu/Debian)
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

## ⚙️ Configuración

El backend está configurado para conectarse a MongoDB con:
- **Host:** localhost
- **Puerto:** 27017
- **Base de datos:** tallermecanico

Estos valores se pueden cambiar en `application.properties`:

```properties
spring.data.mongodb.host=localhost
spring.data.mongodb.port=27017
spring.data.mongodb.database=tallermecanico
```

## 🔍 Verificar que MongoDB está corriendo

```bash
# Verificar estado
mongosh  # o mongo en versiones antiguas

# O verificar el proceso
ps aux | grep mongod
```

## 📊 Acceder a MongoDB

### Usando MongoDB Compass (GUI)
- Descargar: https://www.mongodb.com/try/download/compass
- Conectar a: `mongodb://localhost:27017`
- Base de datos: `tallermecanico`

### Usando línea de comandos
```bash
mongosh
use tallermecanico
db.usuarios.find()
db.servicios.find()
```

## 🗄️ Colecciones

El sistema crea automáticamente:
- **usuarios:** Almacena los usuarios del sistema
- **servicios:** Almacena los servicios mecánicos

## ⚠️ Notas Importantes

- Los datos persisten en MongoDB (a diferencia de H2 en memoria)
- Los usuarios de prueba se crean automáticamente al iniciar el backend
- La base de datos se crea automáticamente al guardar el primer documento

## 🔧 Solución de Problemas

### Error: "Cannot connect to MongoDB"
- Verificar que MongoDB esté corriendo: `brew services list` (macOS) o `sudo systemctl status mongodb` (Linux)
- Verificar que el puerto 27017 esté libre
- Verificar la configuración en `application.properties`

### Error: "Authentication failed"
- Verificar que no haya autenticación configurada en MongoDB (por defecto no requiere autenticación)
- Si MongoDB tiene autenticación, agregar credenciales en `application.properties`:
  ```properties
  spring.data.mongodb.username=usuario
  spring.data.mongodb.password=contraseña
  ```


