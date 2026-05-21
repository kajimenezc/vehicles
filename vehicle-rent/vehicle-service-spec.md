# Especificación de Servicios — vehicle-service

Microservicio de gestión de vehículos.  
**Base URL:** `http://localhost:8082/api/vehicles`  
**Tecnología:** Spring Boot 3.3.4 — Java 21 — MySQL

---

## Modelo `Vehicle`

| Campo | Tipo | Ejemplo | Descripción |
|-------|------|---------|-------------|
| `id` | `number` | `1` | Identificador único (auto-generado) |
| `brand` | `string` | `"Toyota"` | Marca del vehículo |
| `model` | `string` | `"Corolla"` | Modelo del vehículo |
| `state` | `string` | `"disponible"` | Estado (`"disponible"` / `"no_disponible"`) |
| `createDate` | `string` (ISO) | `"2026-05-20T10:30:00"` | Fecha de creación (auto-asignada, solo lectura) |
| `dateReturn` | `string` (ISO) o `null` | `"2026-06-01T00:00:00"` | Fecha estimada de devolución |

---

## Endpoints

### 1. Listar todos los vehículos

```
GET /api/vehicles
```

**Respuesta:** `200 OK`
```json
[
  {
    "id": 1,
    "brand": "Toyota",
    "model": "Corolla",
    "state": "disponible",
    "createDate": "2026-05-20T10:30:00",
    "dateReturn": null
  }
]
```

---

### 2. Buscar vehículos por marca y/o modelo

```
GET /api/vehicles/search?brand={marca}&model={modelo}
```

**Parámetros query** (ambos opcionales):
| Parámetro | Tipo | Ejemplo |
|-----------|------|---------|
| `brand` | `string` | `"Toyota"` |
| `model` | `string` | `"Corolla"` |

Si no se envía ningún filtro, retorna todos los vehículos.  
La búsqueda es **case-insensitive** y **parcial** (contiene).

**Respuesta:** `200 OK`
```json
[
  {
    "id": 2,
    "brand": "Toyota",
    "model": "Yaris",
    "state": "disponible",
    "createDate": "2026-05-19T09:00:00",
    "dateReturn": null
  }
]
```

---

### 3. Obtener vehículo por ID

```
GET /api/vehicles/{id}
```

**Respuesta éxito:** `200 OK`
```json
{
  "id": 1,
  "brand": "Toyota",
  "model": "Corolla",
  "state": "disponible",
  "createDate": "2026-05-20T10:30:00",
  "dateReturn": null
}
```

**Respuesta error:** `404 Not Found`
```json
{
  "timestamp": "2026-05-20T10:35:00",
  "status": 404,
  "error": "Not Found",
  "message": "Vehicle not found with id 99"
}
```

---

### 4. Crear vehículo

```
POST /api/vehicles
```

**Request body:**
```json
{
  "brand": "Honda",
  "model": "Civic",
  "state": "disponible",
  "dateReturn": null
}
```

> **Nota:** El campo `id` se ignora (se auto-genera). `createDate` se asigna automáticamente.

**Respuesta:** `201 Created`
```json
{
  "id": 3,
  "brand": "Honda",
  "model": "Civic",
  "state": "disponible",
  "createDate": "2026-05-20T11:00:00",
  "dateReturn": null
}
```

---

### 5. Actualizar vehículo

```
PUT /api/vehicles/{id}
```

**Request body:** (todos los campos requeridos)
```json
{
  "brand": "Honda",
  "model": "Civic 2026",
  "state": "no_disponible",
  "dateReturn": "2026-06-15T00:00:00"
}
```

> **Nota:** Actualiza **todos** los campos editables (`brand`, `model`, `state`, `dateReturn`). No se puede modificar `id` ni `createDate`.

**Respuesta éxito:** `200 OK`
```json
{
  "id": 3,
  "brand": "Honda",
  "model": "Civic 2026",
  "state": "no_disponible",
  "createDate": "2026-05-20T11:00:00",
  "dateReturn": "2026-06-15T00:00:00"
}
```

**Respuesta error:** `404 Not Found` (si el ID no existe)

---

### 6. Eliminar vehículo

```
DELETE /api/vehicles/{id}
```

**Respuesta éxito:** `204 No Content` (sin cuerpo)

**Respuesta error:** `404 Not Found`
```json
{
  "timestamp": "2026-05-20T10:35:00",
  "status": 404,
  "error": "Not Found",
  "message": "Vehicle not found with id 99"
}
```

---

## Uso desde el frontend

### Configuración

```ts
const VEHICLE_BASE_URL = import.meta.env.VITE_VEHICLE_SERVICE_URL ?? 'http://localhost:8082'
const API_PATH = '/api/vehicles'
```

### Ejemplos de llamadas

```ts
// Listar todos
fetch(`${VEHICLE_BASE_URL}/api/vehicles`)

// Obtener por ID
fetch(`${VEHICLE_BASE_URL}/api/vehicles/1`)

// Buscar
fetch(`${VEHICLE_BASE_URL}/api/vehicles/search?brand=Toyota&model=Corolla`)

// Crear
fetch(`${VEHICLE_BASE_URL}/api/vehicles`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ brand, model, state, dateReturn }),
})

// Actualizar
fetch(`${VEHICLE_BASE_URL}/api/vehicles/1`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ brand, model, state, dateReturn }),
})

// Eliminar
fetch(`${VEHICLE_BASE_URL}/api/vehicles/1`, { method: 'DELETE' })
```
