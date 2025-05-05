# 360BackendChallenge 🚀

## Descripción
Backend para sistema de evaluaciones 360° desarrollado con NestJS, MongoDB y JWT. Proporciona API RESTful para gestión completa de usuarios, empleados y evaluaciones de desempeño.

## 🚀 Instalación Rápida

1. **Clonar repositorio**:
```bash
git clone https://github.com/ByronChang/360BackendChallenge.git
cd 360BackendChallenge
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar entorno** (crear `.env`):
```bash
cat > .env <<EOL
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/360?authSource=admin
JWT_SECRET=tu_clave_secreta_compleja_min_32_chars
PORT=2999
EOL
```

## 💻 Comandos Esenciales

| Comando                | Descripción                              |
|------------------------|------------------------------------------|
| `npm run start:dev`    | Inicia en modo desarrollo (hot reload)   |
| `npm run build`        | Compila a JS para producción            |
| `npm run start:prod`   | Ejecuta la versión compilada            |
| `npm run test`         | Ejecuta suite de pruebas                |

## 🔧 Configuración Requerida

### Variables de Entorno Obligatorias
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret_min_32_chars
PORT=2999
```

### Estructura de Directorios Clave
```
src/
├── auth/               # JWT, login/register
├── employees/          # Gestión empleados
├── evaluations/        # Evaluaciones 360°
├── common/             # Utilidades compartidas
│   ├── filters/        # Manejo de errores
│   ├── interceptors/   # Formato respuestas
└── database/           # Conexión MongoDB
```

## 📚 Documentación API

Accede a Swagger UI en desarrollo:
```
http://localhost:2999/api-docs
```

## 🔐 Roles del Sistema

| Rol        | Permisos                               | Endpoints clave                     |
|------------|----------------------------------------|-------------------------------------|
| `admin`    | Acceso total                           | POST /auth/register, DELETE /users |
| `manager`  | Gestiona su equipo                     | GET /employees, POST /evaluations  |
| `employee` | Autoevaluación y feedback              | GET /evaluations/employee/:id      |

## 🛠️ Endpoints Principales

### Autenticación
- `POST /auth/register` - Registro (solo admin)
- `POST /auth/login` - Inicio sesión

### Empleados
- `POST /employees` - Crear empleado
- `GET /employees/:id` - Obtener detalle

### Evaluaciones
- `POST /evaluations` - Crear evaluación
- `GET /evaluations/employee/:id` - Listar por empleado

## 🐛 Solución de Problemas Comunes

**Error de conexión a MongoDB**:
```bash
# Verificar URI:
echo $MONGODB_URI | grep -o "@[^/]*"  # Muestra usuario y cluster
```

**Error JWT**:
```bash
# Verificar secreto:
[ -z "$JWT_SECRET" ] && echo "Falta JWT_SECRET" || echo "Secreto configurado"
```

## 📦 Dependencias Clave

```json
"dependencies": {
  "@nestjs/common": "^9.0.0",
  "@nestjs/mongoose": "^9.0.0",
  "@nestjs/jwt": "^9.0.0",
  "mongoose": "^6.0.0",
  "bcryptjs": "^2.4.3"
}
```

## 📄 Licencia
MIT © [Byron Chang] 2025
```