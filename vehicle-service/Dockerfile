# ETAPA 1: Compilación (Usa Maven para construir el .jar)
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app
# Copia tu código fuente al contenedor
COPY . .
# Compila el proyecto saltando los tests para ir más rápido
RUN mvn clean package -DskipTests

# ETAPA 2: Ejecución (Solo lleva el .jar final para que sea ligero)
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
# Copia solo el archivo .jar generado en la etapa anterior
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]