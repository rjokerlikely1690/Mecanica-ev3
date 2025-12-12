## Guía rápida para correr el proyecto en VS Code

### 1. Requisitos instalados
- Java 17 o superior.
- Maven 3.6+ (verifica con `mvn -v`).
- Node.js 18+ y npm (`node -v`, `npm -v`).
- Acceso al cluster de MongoDB Atlas con la URI ya configurada en `backend/src/main/resources/application.properties`.

### 2. Lanzar el backend (Spring Boot)
1. Abre VS Code en la carpeta `mecanica ev3`.
2. En una terminal integrada:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
3. Espera a ver en la consola: `Tomcat started on port 8080`.  
   El backend ya estará sirviendo en `http://localhost:8080`.

### 3. Lanzar el frontend (React)
1. Abre otra terminal en VS Code:
   ```bash
   cd frontend
   npm install          # solo la primera vez
   npm start            # o: node node_modules/react-scripts/scripts/start.js
   ```
2. El navegador abrirá `http://localhost:3000`.

### 4. Variables y credenciales
- El backend lee la URI completa de MongoDB desde `backend/src/main/resources/application.properties`:
  ```
  spring.data.mongodb.uri=mongodb+srv://roanania_db_user:HyJ6baMyL7YPocPj@mecanica.pmqw9lj.mongodb.net/tallermecanico?retryWrites=true&w=majority
  spring.main.allow-circular-references=true
  ```
  Ajusta la contraseña si la cambias en Atlas.
- Asegúrate de que la IP actual esté permitida en **Network Access** de Atlas antes de iniciar.

### 5. Pruebas rápidas
- `curl http://localhost:8080/api/servicios` con un token válido verifica la API.
- Ingresa en el frontend con los usuarios precargados:
  - Admin: `admin@automax.cl` / `admin123`
  - Cliente: `cliente@test.cl` / `cliente123`

Con estos pasos puedes presentar el proyecto directamente desde VS Code sin pasos adicionales.***

