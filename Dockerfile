# STEP-1: BUILD STAGE
# Usar una imagen base de Node.js específica para construir el proyecto Angular
# Es recomendable especificar una versión para evitar problemas futuros
FROM node:18-alpine as node-builder

# Aceptar un argumento para configurar el entorno de compilación
# Útil para múltiples entornos (dev, tst, staging, prod)
# ARG build_env=development
ARG build_env=development

# Definir el directorio de trabajo dentro del contenedor
WORKDIR /app

# Limpiar caché de npm para evitar conflictos
RUN npm cache clean --force

# Copiar todos los archivos del proyecto al directorio de trabajo del contenedor
COPY . .

# Instalar dependencias del proyecto
RUN npm install

# Compilar el proyecto Angular con la configuración especificada
RUN npm run build -- --configuration=$build_env

# STEP-2: RUNTIME STAGE
# Usar una imagen base de Nginx para servir la aplicación Angular
FROM nginx:1.25 as nginx-runtime

# Copiar los archivos compilados desde el contenedor de construcción a Nginx
COPY --from=node-builder /app/dist/fuse/browser/ /usr/share/nginx/html

# Copiar el archivo de configuración personalizado de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80 para servir la aplicación
EXPOSE 81

# Comando por defecto para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
