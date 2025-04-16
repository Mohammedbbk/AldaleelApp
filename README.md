

# Aldaleel Microservices & Gateway (AldaleelMCP)

## Description

This project serves as the backend for the Aldaleel mobile application. It functions as an API gateway and orchestrates several microservices to provide travel planning functionalities, including:

* AI-powered itinerary generation.
* Information proxying for visa requirements, cultural insights, and live events.
* Integration with accommodation and other travel-related services (TripAdvisor, Airbnb, Mapbox).
* Data persistence (likely via Supabase, based on configuration).

## Architecture

The backend follows a microservices pattern managed by a central Node.js/Express gateway (`server.js`). The gateway handles incoming requests from the frontend (`AldaleelApp`), routes them, and communicates with specialized microservices running within the same deployment instance (on Render). Communication between the gateway and internal microservices primarily uses `http://localhost:<port>`.

**Core Components:**

* **Gateway (`server.js`):** Main entry point, handles routing, middleware (CORS, rate limiting, request logging), and starts other microservices.
* **Microservice Manager (`services/microserviceManager.js`):** Responsible for starting and potentially monitoring the various microservice processes based on `config/servers.config.js`.
* **AI Service (`openai-server.js`, `services/aiService.js`):** Connects to OpenAI API (GPT-4 Turbo) to generate travel itineraries based on user input.
* **Visa Service (`visa-requirements-server.js`):** Fetches visa information, likely by querying an LLM/Brave Search endpoint. (Runs on dedicated port, e.g., 8009).
* **Culture Service (`culture-insights-server.js`):** Fetches cultural insights, likely by querying an LLM/Brave Search endpoint. (Runs on dedicated port, e.g., 8008).
* **Events Service (`live-events-server.js`):** Fetches live event information (likely via Ticketmaster). (Runs on dedicated port, e.g., 8005).
* **Travel Planner Service (`mapbox-travel-planner.js`):** Handles route/travel planning using Mapbox. (Runs on dedicated port, e.g., 8004).
* **TripAdvisor Service (`server.py`):** Python/Flask service integrating with TripAdvisor. (Runs on dedicated port, e.g., 8006).
* **Airbnb Service (`@openbnb/mcp-server-airbnb`):** Service for Airbnb integration (requires separate installation). (Runs on dedicated port, e.g., 8007).
* **Database Service (`services/tripService.js`):** Interacts with the Supabase database for storing/retrieving trip data.

## Features

* User authentication support (implied, handled by frontend/gateway interaction).
* Trip creation based on user inputs (destination, dates, style, budget, interests, duration, nationality).
* Dynamic fetching of Visa requirements and Cultural insights via LLM proxy.
* AI-powered itinerary generation.
* Fetching of nearby events during the trip dates.
* Supabase integration for data storage.
* API documentation via Swagger UI (`/api-docs`).

## Tech Stack

* **Backend:** Node.js, Express.js, Axios
* **Microservices:** Node.js, Python 3.10+ (for TripAdvisor/Flask), `@openbnb/mcp-server-airbnb`
* **AI:** OpenAI API (GPT-4 Turbo)
* **Database:** Supabase
* **APIs:** Mapbox, Ticketmaster, TripAdvisor, Pixabay (Frontend), Brave Search (indirectly via LLM likely), OpenWeatherMap (Frontend)
* **Deployment:** Render (Single Service deployment)
* **Configuration:** `dotenv`
* **Logging:** Custom logger (`server-logger.js`)
* **Other:** CORS, Rate Limiting (express-rate-limit), Swagger UI

## Project Structure (`AldaleelMCP`)

```
.
├── config/             # Configuration files (env vars, servers, Supabase client)
├── controllers/        # Request handling logic for specific routes
├── gateway/            # Entry point for deployment (references server.js)
├── logs/               # Directory for log files
├── middleware/         # Express middleware (error handling, validation, rate limiting)
├── routes/             # Express route definitions
├── services/           # Business logic, service interactions (AI, DB, Microservice Mgr)
├── types/              # TypeScript type definitions (if used)
├── utils/              # Utility functions
├── server.js           # Main Express gateway application setup and startup
├── *.js                # Individual microservice server files (openai, visa, culture, etc.)
├── server.py           # TripAdvisor Flask server
├── requirements.txt    # Python dependencies (for server.py)
├── package.json        # Node.js project dependencies and scripts
├── .env                # Local environment variables (DO NOT COMMIT SECRET KEYS)
├── .env.example        # Template for environment variables
└── Dockerfile          # Docker configuration (if used for deployment)
```

## Setup & Installation (Local Development)

1.  **Prerequisites:**
    * Node.js (LTS version recommended, e.g., v18 or v20)
    * npm or yarn
    * Python 3.10+ (for the TripAdvisor service)
    * `pip` (Python package installer)

2.  **Clone Repository:**
    ```bash
    git clone <your-repo-url>
    cd AldaleelMCP
    ```

3.  **Install Node.js Dependencies:**
    ```bash
    npm install
    # OR
    yarn install
    ```

4.  **Install Python Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

5.  **Install Missing MCP Packages (if applicable):**
    * The Airbnb server failed in logs due to a missing package. Install it if needed:
        ```bash
        npm install @openbnb/mcp-server-airbnb
        ```

6.  **Configure Environment Variables:**
    * Copy the `.env.example` file to a new file named `.env`:
        ```bash
        cp .env.example .env
        ```
    * **Edit the `.env` file:** Fill in all the required API keys (OpenAI, Supabase, Mapbox, Ticketmaster, TripAdvisor) and URLs (Supabase). Use the consolidated list from our debugging session as a reference.
    * **Set Ports:** Ensure all `_PORT` variables are defined and **unique**. Use `VISA_REQUIREMENTS_PORT=8009` to avoid conflict with Airbnb (8007).
    * **Set Service URLs:** For local development, set `VISA_SERVICE_URL=http://localhost:8009` and `CULTURE_SERVICE_URL=http://localhost:8008`. Verify `BRAVE_MCP_URL`.
    * Set `NODE_ENV=development`.

7.  **Run the Backend:**
    * Start the main gateway server. This should also trigger the start of all microservices defined in `servers.config.js` via `microserviceManager.js`.
        ```bash
        node server.js
        ```
    * Monitor the console output for successful startup messages and any errors from the gateway or the microservices.

## Environment Variables

Environment variables are crucial for configuring API keys, service URLs, ports, and behavior without hardcoding them.

* Refer to `.env.example` for a template of required and optional variables.
* **Local Development:** Uses the `.env` file at the root of `AldaleelMCP`.
* **Render Deployment:** Ignores `.env`. Variables **must** be set in the service's "Environment" tab on the Render dashboard.

**Key Variables for Render Deployment:**

* `NODE_ENV=production`
* All API Keys (`OPENAI_API_KEY`, `SUPABASE_KEY`, `MAPBOX_API_KEY`, etc.)
* `SUPABASE_URL`
* `VISA_SERVICE_URL=http://localhost:8009` *(Crucial: Uses localhost as services run in the same Render instance)*
* `CULTURE_SERVICE_URL=http://localhost:8008` *(Crucial: Uses localhost)*
* `BRAVE_MCP_URL` *(Verify correct value for Render environment)*
* `BRAVE_API_ENDPOINT`
* All required `_PORT` variables (`PORT=8000`, `VISA_REQUIREMENTS_PORT=8009`, `CULTURE_INSIGHTS_PORT=8008`, etc.)

*(See the consolidated list generated previously for the full recommended set for Render).*

## Running the Full Stack (Frontend + Backend)

1.  **Start Backend:** Run `node server.js` in the `AldaleelMCP` directory (or ensure it's running on Render).
2.  **Configure Frontend:**
    * Navigate to the `AldaleelApp` directory.
    * Ensure `AldaleelApp/app.json` (or `app.config.js`) has the correct `extra.pixabayApiKey` set.
    * Modify `AldaleelApp/src/config/constants.js`:
        * Set `API.BASE_URL` to `http://localhost:8000/api` if running the backend locally.
        * Set `API.BASE_URL` to `https://aldaleelapp-mcp.onrender.com/api` if connecting to the deployed backend.
3.  **Start Frontend:**
    ```bash
    cd ../AldaleelApp
    npx expo start
    ```
    Follow the instructions to open the app in an emulator, simulator, or on a physical device using the Expo Go app.

## API Documentation

API documentation is generated using Swagger UI and is available at the `/api-docs` endpoint when the gateway server is running (e.g., `http://localhost:8000/api-docs` locally or `https://aldaleelapp-mcp.onrender.com/api-docs` deployed).

## Deployment

This service is deployed on Render as a single Node.js service instance which runs `node server.js`. This script starts the main gateway and uses `microserviceManager.js` to launch the other microservice processes (Node.js and Python) within the same instance.

**Key Deployment Steps:**

1.  Ensure all code changes (including the fixed `servers.config.js`) are committed.
2.  Connect the GitHub/GitLab repository to Render.
3.  Create a new "Web Service" on Render.
4.  Set the "Build Command" (e.g., `npm install && npm install @openbnb/mcp-server-airbnb && pip install -r requirements.txt`) - Adjust as needed.
5.  Set the "Start Command" (e.g., `node server.js`).
6.  Configure all necessary **Environment Variables** in the Render UI as detailed above.
7.  Deploy. Monitor deployment logs for successful startup of all services.

## Troubleshooting

* **`Network request failed` (Frontend):** Usually means the frontend cannot reach the `API.BASE_URL`. Check the URL, ensure the backend server is running, check network connectivity (localhost vs IP address for physical devices), check Render service status.
* **`Failed to proxy ... request` (Backend Gateway Logs):** Usually means the gateway successfully received the request but failed to connect to the target *internal* microservice (e.g., Visa, Culture, AI). Check if the microservice is running (verify `servers.config.js` and Render startup logs), check if the correct `localhost:<port>` is being used by the controller (`proxyController.js`, `aiService.js`), check the specific microservice's logs for internal errors.
* **Port Conflicts:** Ensure all services defined in `servers.config.js` and `.env` have unique ports assigned.
* **API Key Errors:** Double-check all API keys in the Render Environment Variables are correct and active. Check logs for specific authentication errors from external APIs (OpenAI, Mapbox, etc.).
* **Missing Data (`"days" is required`, etc.):** Trace the data flow back through the frontend screens to ensure user input is collected and passed correctly via navigation parameters.
* **Check Logs:** Render deployment logs and runtime logs are essential for diagnosing issues. Examine logs from the gateway and, if possible, individual microservices.



---
