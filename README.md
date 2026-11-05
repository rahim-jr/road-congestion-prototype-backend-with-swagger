# Dhaka Traffic Congestion Prediction API

A backend prototype for collecting real-time and user-reported traffic data for Dhaka,
Bangladesh, storing congestion levels, and suggesting the best departure time & route.

## Tech Stack

- Bun.js
- Express.js
- SQLite (via `bun:sqlite`) — switched from MongoDB per request for a self-contained, runnable prototype
- swagger-ui-express + swagger-jsdoc
- dotenv, cors, morgan

## Project Structure

```
.
├── server.js
├── swagger.js
├── src/
│   ├── config/db.js
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   └── seed/seedRoads.js
├── .env.example
└── README.md
```

## Setup

1. Install Bun: https://bun.sh
2. Install dependencies:

   ```bash
   bun install
   ```

3. Copy environment file:

   ```bash
   cp .env.example .env
   ```

4. Seed sample roads:

   ```bash
   bun run seed
   ```

5. Start the server:

   ```bash
   bun run start
   # or with watch mode
   bun run dev
   ```

Server runs on `http://localhost:8000` (or `PORT` from `.env`).
Swagger docs: `http://localhost:8000/api/docs`

## API Endpoints (Base URL: /api)

- `GET /roads` — Get all roads
- `POST /traffic/report` — User reports congestion/accident/roadblock
- `POST /traffic/data` — Add congestion data (admin/system/sensors)
- `PUT /traffic/data/:id` — Update congestion record
- `GET /traffic/current` — Get current congestion (query: roadId optional)
- `GET /traffic/history` — Get past congestion data (query: roadId, hours)
- `GET /route/suggest` — Suggest best departure time & route (query: from, to)

## Environment Variables

See `.env.example`.
- `PORT` — server port (default 8000)
- `NODE_ENV` — environment
- `DB_PATH` — SQLite database file path
# road-congestion-prototype-backend-with-swagger
