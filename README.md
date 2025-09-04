# School Management API

A Node.js REST API for managing school data with proximity-based sorting functionality.

## Features

- ✅ Add new schools with validation
- ✅ List schools sorted by proximity to user location
- ✅ SQLite database integration (file-based, no server required)
- ✅ Input validation with Joi
- ✅ Error handling middleware
- ✅ CORS enabled
- ✅ Environment configuration

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd school-management-api
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - The database file will be created automatically at `./database/schools.db`

4. Start the application:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### 1. Health Check
- **GET** `/`
- Returns API status and available endpoints

### 2. Add School
- **POST** `/addSchool`
- **Body**:
```json
{
  "name": "ABC School",
  "address": "123 Main Street, City, State",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

### 3. List Schools (Sorted by Proximity)
- **GET** `/listSchools?latitude=40.7128&longitude=-74.0060`
- **Query Parameters**:
  - `latitude`: User's latitude (-90 to 90)
  - `longitude`: User's longitude (-180 to 180)

### 4. Get All Schools
- **GET** `/schools`
- Returns all schools without sorting

### 5. Get School by ID
- **GET** `/schools/:id`
- Returns a specific school by ID

## Database Schema

### Schools Table (SQLite)
```sql
CREATE TABLE schools (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_FILE` | SQLite database file path | ./database/schools.db |
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |

## Distance Calculation

The API uses the Haversine formula to calculate the distance between two geographic points:

```javascript
distance = 2 * R * arcsin(sqrt(sin²(Δlat/2) + cos(lat1) * cos(lat2) * sin²(Δlon/2)))
```

Where:
- R = Earth's radius (6371 km)
- Δlat = lat2 - lat1 (in radians)
- Δlon = lon2 - lon1 (in radians)

## Error Handling

The API includes comprehensive error handling for:
- Input validation errors
- Database connection errors
- MySQL-specific errors
- JSON parsing errors
- 404 Not Found errors

## Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Validation error details"]
}
```

## Testing

Use the provided Postman collection for testing all endpoints:

1. Import the collection into Postman
2. Set up environment variables
3. Run the requests

## Deployment

### Local Development
```bash
npm run dev
```

### Production Deployment

1. The SQLite database file is self-contained and will be created automatically
2. Use PM2 for process management:
```bash
npm install -g pm2
pm2 start server.js --name "school-api"
```

3. For platforms like Render, Heroku, or Vercel:
   - No database setup required - SQLite file is included with your code
   - Set environment variable: `DB_FILE=./database/schools.db`
   - The database file will persist with your application

## License

MIT License
