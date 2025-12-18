# AutoMax Taller Mecánico (Fullstack)

Repositorio para revisión académica/profesional del proyecto **AutoMax**.

## Estructura

- `frontend/`: Aplicación React (UI).
- `backend/`: API REST Java (Spring Boot).
- `docs/`: Documentación del proyecto (archivos entregables).
- `frontend.zip` / `backend.zip`: Copias comprimidas del código.

## Tecnologías

- **Frontend**: React (Create React App), JavaScript, CSS.
- **Backend**: Java, Spring Boot, Spring Security (JWT), JPA/Hibernate.

## Ejecución (local)

### Backend

```bash
cd backend
mvn spring-boot:run
```

- Por defecto la configuración está en `backend/src/main/resources/application.properties`.

### Frontend

```bash
cd frontend
npm install
npm start
```

## Notas

- No se incluyen dependencias compiladas (`node_modules/`, `target/`) en el repositorio.
