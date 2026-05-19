# Microservicios con Docker Compose

Este proyecto configura microservicios Spring Boot con Eureka para service discovery y un API Gateway, todo ejecutándose en contenedores Docker usando Docker Compose.

## Servicios

- **mysql**: Base de datos MySQL
- **eureka-server**: Servidor Eureka (puerto 8761)
- **management-vehicle**: Microservicio de gestión de vehículos (puerto 8080)
- **vehicle-service**: Microservicio de vehículos (puerto 8082)
- **api-gateway**: Gateway API (puerto 8081)

## Requisitos

- Docker
- Docker Compose

## Ejecutar

1. Construir y ejecutar todos los servicios:
   ```bash
   |
   ```

2. Acceder a:
   - Eureka Dashboard: http://localhost:8761
   - API Gateway: http://localhost:8081
   - Management Vehicle: http://localhost:8080
   - Vehicle Service: http://localhost:8082

## Detener

```bash
docker-compose down
```

## Notas

- Los servicios se inician en orden: mysql -> eureka-server -> microservicios -> api-gateway
- Las bases de datos se persisten en un volumen Docker llamado `mysql_data`