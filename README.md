# MediSys - Sistema de Registros Médicos Electrónicos

Sistema integral de Gestión Hospitalaria construido con Next.js 15, que incluye control de acceso basado en roles, gestión de citas, historiales médicos y flujos de trabajo para atención al paciente.

## 🏥 Características

### Sistema Multi-Rol

- **Administrador**: Gestión completa del sistema, analíticas y supervisión
- **Doctor**: Gestión de pacientes, citas, notas clínicas e historiales médicos
- **Paciente**: Reserva de citas, visualización de historial médico y gestión de perfil
- **Enfermera**: Funciones de cuidado y soporte al paciente
- **Técnico de Laboratorio**: Gestión de pruebas de laboratorio
- **Cajero**: Gestión de pagos y facturación

### Funcionalidades Principales

- **Gestión de Citas**: Programar, reprogramar y hacer seguimiento de citas
- **Historiales Médicos**: Historial médico completo del paciente y notas clínicas
- **Facturación y Pagos**: Procesamiento integrado de pagos y gestión de facturación
- **Portal del Paciente**: Reserva de citas autoservicio y acceso a historial médico
- **Dashboard de Analíticas**: Estadísticas en tiempo real y métricas de rendimiento
- **Gestión de Personal**: Directorio completo del personal y gestión de perfiles

### Características Técnicas

- **Autenticación**: Autenticación segura basada en roles con Clerk
- **Base de Datos**: PostgreSQL con Prisma ORM
- **UI/UX**: Diseño moderno y responsive con Tailwind CSS y Radix UI
- **Actualizaciones en Tiempo Real**: Estado de citas en vivo y notificaciones
- **Gestión de Archivos**: Carga y almacenamiento de documentos médicos
- **Búsqueda y Filtros**: Capacidades avanzadas de búsqueda en todos los módulos

## 🚀 Comenzando

### Prerequisitos

- Node.js 18+
- Base de datos PostgreSQL
- Cuenta de Clerk para autenticación

### Instalación

1. **Clonar el repositorio**

   ```bash
   git clone <url-del-repositorio>
   cd Electronic-Medical-App-main
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   # o
   pnpm install
   ```

3. **Configuración del Entorno**
   
   Crea un archivo `.env.local` en el directorio raíz:

   ```env
   DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/medisys_hms"
   CLERK_SECRET_KEY="tu_clerk_secret_key"
   CLERK_PUBLISHABLE_KEY="tu_clerk_publishable_key"
   ```

4. **Configuración de la Base de Datos**

   ```bash
   # Generar cliente de Prisma
   npx prisma generate

   # Ejecutar migraciones de la base de datos
   npx prisma db push

   # Poblar la base de datos con datos de ejemplo
   npx prisma db seed
   ```

5. **Iniciar el servidor de desarrollo**

   ```bash
   npm run dev
   # o
   pnpm dev
   ```

6. **Abrir el navegador**
   
   Navega a [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
Electronic-Medical-App-main/
├── app/                    # Directorio de Next.js
│   ├── (auth)/            # Páginas de autenticación
│   ├── (protected)/       # Rutas protegidas por rol
│   │   ├── admin/         # Dashboard de administrador
│   │   ├── doctor/        # Dashboard de doctor
│   │   ├── patient/       # Portal del paciente
│   │   └── record/        # Gestión de historiales médicos
│   ├── actions/           # Server actions
│   └── api/               # Rutas API
├── components/            # Componentes UI reutilizables
│   ├── charts/           # Visualización de datos
│   ├── forms/            # Componentes de formularios
│   ├── tables/           # Tablas de datos
│   └── ui/               # Componentes UI base
├── lib/                  # Librerías de utilidad
├── prisma/               # Esquema de base de datos y migraciones
├── types/                # Definiciones de tipos TypeScript
└── utils/                # Funciones auxiliares y servicios
```

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Autenticación**: Clerk
- **Estilos**: Tailwind CSS
- **Componentes UI**: Radix UI
- **Gráficos**: Recharts
- **Formularios**: React Hook Form con validación Zod
- **Iconos**: Lucide React
- **Deployment**: Preparado para Vercel

## 🔐 Autenticación y Autorización

El sistema utiliza Clerk para autenticación con control de acceso basado en roles:

- **Administrador**: Acceso completo al sistema
- **Doctor**: Gestión de pacientes e historiales médicos
- **Paciente**: Citas personales e historial médico
- **Personal**: Permisos específicos según el rol

## 📊 Esquema de Base de Datos

La aplicación utiliza un esquema de base de datos integral que incluye:

- **Pacientes**: Perfiles completos de pacientes e historial médico
- **Doctores**: Perfiles del personal y especializaciones
- **Citas**: Programación y seguimiento de estado
- **Historiales Médicos**: Notas clínicas y diagnósticos
- **Pagos**: Facturación y procesamiento de pagos
- **Calificaciones**: Sistema de retroalimentación del paciente

## 🚀 Deployment

### Deployment en Vercel

1. Conecta tu repositorio de GitHub a Vercel
2. Configura las variables de entorno en el dashboard de Vercel
3. Despliega automáticamente con cada push a la rama main

### Variables de Entorno

Asegúrate de que todas las variables de entorno requeridas estén configuradas en tu plataforma de deployment:

- `DATABASE_URL`
- `CLERK_SECRET_KEY`
- `CLERK_PUBLISHABLE_KEY`

## 🤝 Contribuir

1. Haz un fork del repositorio
2. Crea una rama para tu funcionalidad (`git checkout -b feature/funcionalidad-increible`)
3. Haz commit de tus cambios (`git commit -m 'Agregar funcionalidad increíble'`)
4. Haz push a la rama (`git push origin feature/funcionalidad-increible`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está licenciado bajo la Licencia MIT - consulta el archivo [LICENSE](LICENSE) para más detalles.

## 🆘 Soporte

Para soporte y preguntas:

- Crea un issue en el repositorio de GitHub
- Contacta al equipo de desarrollo
- Consulta la documentación en la carpeta `/docs`

## Historial de Versiones

- **v0.1.0**: Lanzamiento inicial con funcionalidad central del HMS
  - Sistema de autenticación multi-rol
  - Gestión de citas
  - Sistema de historiales médicos
  - Portal del paciente
  - Dashboard de administrador con analíticas

---

**MediSys** - Optimizando la gestión hospitalaria con tecnología moderna.

## 📸 Capturas de Pantalla

### Dashboard de Administrador
Panel de control con estadísticas en tiempo real, gestión de usuarios y analíticas del sistema.

### Portal del Doctor
Interfaz completa para gestión de pacientes, citas y actualización de historiales médicos.

### Portal del Paciente
Sistema autoservicio para reserva de citas, visualización de historial médico y gestión de perfil.

## 🎯 Próximas Funcionalidades

- [ ] Sistema de mensajería interna entre doctores y pacientes
- [ ] Integración con dispositivos médicos IoT
- [ ] Telemedicina y consultas virtuales
- [ ] Sistema de prescripción electrónica
- [ ] Reportes y analíticas avanzadas con IA
- [ ] App móvil nativa (iOS/Android)
- [ ] Sistema de inventario de farmacia
- [ ] Integración con laboratorios externos

## 💡 Casos de Uso

- **Hospitales Privados**: Gestión completa de operaciones hospitalarias
- **Clínicas Médicas**: Sistema de citas y seguimiento de pacientes
- **Centros de Salud**: Coordinación de personal médico y pacientes
- **Consultorios Individuales**: Gestión simplificada de práctica médica

## 🔒 Seguridad

- Autenticación de dos factores (2FA) disponible
- Encriptación de datos sensibles end-to-end
- Cumplimiento con regulaciones HIPAA
- Auditoría de acceso y cambios en historiales médicos
- Backup automático de datos
- Recuperación ante desastres

## 📱 Compatibilidad

- ✅ Navegadores modernos (Chrome, Firefox, Safari, Edge)
- ✅ Responsive design para tablets y móviles
- ✅ PWA (Progressive Web App) capable
- ✅ Soporte para modo oscuro

## 🌐 Internacionalización

- Soporte para múltiples idiomas
- Configuración regional de fecha/hora
- Formatos de moneda locales
- Traducción de términos médicos

---
