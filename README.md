# Real Estate Portal

A full-stack real estate web application inspired by platforms like Idealista or Fotocasa, where users can browse, publish, and manage property listings for sale or rent. The project was built as a final degree project and covers the full development cycle: database design, REST API, authentication, and a responsive single-page frontend.

---

## Screenshots

| Home | Listings & Filters |
|------|-------------------|
| ![Home](Imagenes/ScreenShot%20pagina/00Home%20page%201.jpg) | ![Listings](Imagenes/ScreenShot%20pagina/00Todos%20los%20anuncios%20y%20filtros.jpg) |

| Property Detail | Seller Contact |
|----------------|---------------|
| ![Detail](Imagenes/ScreenShot%20pagina/00Anuncio%20concreto.jpg) | ![Seller](Imagenes/ScreenShot%20pagina/00Contacto%20del%20vendedor.jpg) |

| User Profile | Favourites |
|-------------|-----------|
| ![Profile](Imagenes/ScreenShot%20pagina/00Mi%20perfil.jpg) | ![Favourites](Imagenes/ScreenShot%20pagina/00Mis%20favoritos.jpg) |

| Publish Listing | Filtered Search |
|----------------|----------------|
| ![Publish](Imagenes/ScreenShot%20pagina/Publicar%201.jpg) | ![Search](Imagenes/ScreenShot%20pagina/B%C3%BAsqueda%20filtrada.jpg) |

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Angular 19 (TypeScript) | SPA framework |
| Angular Router | Page navigation and route guards |
| HTTP Interceptor | Automatically attaches JWT to every request |
| Custom Pipes | Data formatting in templates |
| Angular Guards | Blocks unauthenticated access to protected routes |

### Backend
| Technology | Purpose |
|---|---|
| Java 17 + Spring Boot 3.4.1 | REST API framework |
| Spring Security | Authentication and authorization |
| JWT (jjwt 0.11.5) | Stateless token-based auth |
| Spring Data JPA | ORM and database access |
| MariaDB | Relational database |
| Lombok | Boilerplate reduction |
| SpringDoc OpenAPI 2.2 | Auto-generated Swagger UI |

---

## Features

### For all users (no login required)
- Browse all property listings
- Filter by transaction type (sale / rent), property type, price range, number of rooms, square meters and amenities
- View full listing detail: photos, description, address, price, and property specifications
- Register a new account

### For authenticated users
- Log in and receive a JWT token
- View seller contact information on any listing
- Save listings to favourites and manage them from the profile page
- Publish new property listings with a multi-step form and photo upload
- View, edit and delete your own published listings
- Access a personal profile page with account details

### Security
- Passwords stored securely via Spring Security
- JWT issued on login and validated on every protected request via a custom Spring Security filter
- Angular route guards prevent access to restricted pages without a valid token
- HTTP interceptor injects the token automatically — no manual handling needed in each service

---

## Data Model

### Listing (`Anuncio`)
Each listing contains:
- **Basic info**: price, description, address, square meters
- **Rooms**: number of bedrooms and bathrooms
- **Amenities** (boolean flags): pool, elevator, garage, storage room, terrace, balcony, sea views, paddle court
- **Photos**: one-to-many relationship with `AnuncioFotos`
- **Seller**: many-to-one relationship with `Usuario`
- **Favourites**: many-to-many relationship with `Usuario`
- **Enums**:
  - `PropertyType` — type of property (apartment, house, etc.)
  - `TransactionType` — sale or rent
  - `PropertyState` — new build, second hand, etc.

### User (`Usuario`)
Stores user credentials and profile data, linked to their published listings and saved favourites.

---

## API Overview

The REST API is documented with Swagger UI, available at:
```
http://localhost:8081/swagger-ui.html
```

Main endpoints:

| Method | Endpoint | Description | Auth required |
|--------|----------|-------------|--------------|
| POST | `/login` | Authenticate and receive JWT | No |
| POST | `/registro` | Register a new user | No |
| GET | `/anuncios` | Get all listings | No |
| GET | `/anuncios/{id}` | Get listing by ID | No |
| POST | `/anuncios` | Create a new listing | Yes |
| PUT | `/anuncios/{id}` | Update a listing | Yes |
| DELETE | `/anuncios/{id}` | Delete a listing | Yes |

---

## Project Structure

```
mi-proyecto/
├── ProyectoBack/                  # Spring Boot backend
│   └── src/main/java/
│       ├── controller/            # REST controllers (Anuncio, Login)
│       ├── model/                 # JPA entities
│       ├── repository/            # Spring Data JPA interfaces
│       ├── services/              # Business logic layer
│       ├── security/              # JWT filter, UserDetailsService, SecurityConfig
│       ├── config/                # CORS and app configuration
│       └── enumeraciones/         # PropertyType, TransactionType, PropertyState
│
└── ProyectoFront/                 # Angular 19 frontend
    └── src/app/
        ├── Pages/                 # Routed pages
        │   ├── home/              # Landing page
        │   ├── anuncios/          # All listings with filters
        │   ├── anuncio/           # Single listing detail
        │   ├── publicar-anuncio/  # Multi-step publish form
        │   ├── mi-perfil/         # User profile, favourites, my listings
        │   ├── inicio-sesion/     # Login
        │   └── registro/          # Register
        ├── Components/            # Shared UI components
        ├── Services/              # HTTP services (listings, auth, user)
        ├── Guards/                # Auth guards for protected routes
        ├── Interceptor/           # JWT interceptor
        ├── Modelos/               # TypeScript interfaces
        ├── Pipes/                 # Custom data pipes
        └── Enum/                  # Frontend enums matching backend
```

---

## Getting Started

### Requirements
- Node.js 18+
- Java 17+
- MariaDB

### 1. Database

Create a MariaDB database and configure the connection in `ProyectoBack/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mariadb://localhost:3306/your_database
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

### 2. Backend

```bash
cd ProyectoBack
./mvnw spring-boot:run
```

The API will start on `http://localhost:8081`.
Swagger UI available at `http://localhost:8081/swagger-ui.html`.

### 3. Frontend

```bash
cd ProyectoFront
npm install
ng serve
```

Open `http://localhost:4200` in your browser.
