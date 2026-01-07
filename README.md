# Blog Backend

Backend API para un sistema de blog con autenticación, posts, categorías y administración.

## Tecnologías

- Node.js
- Express.js
- Prisma (ORM para PostgreSQL)
- JWT para autenticación
- bcrypt para hashing de contraseñas

## Instalación

1. Clona el repositorio
2. Instala dependencias: `npm install`
3. Configura la base de datos PostgreSQL y actualiza `.env`
4. Ejecuta migraciones: `npx prisma migrate dev`
5. Genera Prisma Client: `npx prisma generate`
6. Inicia el servidor: `npm start`

## Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```
DATABASE_URL="postgresql://usuario:password@localhost:5432/blog_db"
PORT=4000
JWT_SECRET=tu_clave_secreta_jwt
```

## API Endpoints

### Autenticación

- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión

### Posts

- `GET /api/posts` - Obtener posts publicados (público)
- `GET /api/posts/:id` - Obtener post por ID (público si publicado, autenticado si no)
- `POST /api/posts` - Crear post (autenticado)
- `PUT /api/posts/:id` - Actualizar post (autenticado, autor o admin)
- `DELETE /api/posts/:id` - Ocultar post (soft delete, autenticado, autor o admin)
- `GET /api/posts/admin/all` - Obtener todos los posts incluyendo no publicados (admin)

### Categorías

- `GET /api/categories` - Obtener categorías (público)
- `GET /api/categories/:id` - Obtener categoría por ID (público)
- `POST /api/categories` - Crear categoría (admin)
- `PUT /api/categories/:id` - Actualizar categoría (admin)
- `DELETE /api/categories/:id` - Eliminar categoría (admin)

## Roles de Usuario

- `user`: Usuario normal, puede crear y editar sus propios posts
- `admin`: Administrador, puede gestionar todos los posts y categorías

## Funcionalidades

- Autenticación JWT
- CRUD de posts con soft delete (ocultar/despublicar)
- Gestión de categorías
- Control de acceso basado en roles
- Manejo de errores centralizado

## Desarrollo

Para desarrollo, usa `npm run dev` si tienes nodemon configurado.

## Base de Datos

El esquema de Prisma incluye modelos para User, Post, Category y Token.

Para resetear la base de datos: `npx prisma migrate reset`
