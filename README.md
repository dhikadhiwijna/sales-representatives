# Project Setup Guide

## Running the Application Manually

### Backend
1. Navigate to the backend folder:
    ```bash
    cd backend
    ```
2. Create a Python virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4. Start the server:
    ```bash
    uvicorn main:app --reload
    ```

### Frontend
1. Navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the application:
    ```bash
    npm start
    ```

## Running the Application with Docker Compose
1. Ensure Docker is installed and running on your system.
2. Run the following command in the project root directory:
    ```bash
    docker-compose up
    ```
3. Access the application in your browser at the specified URL (e.g., `http://localhost:3000`).

## Notes
- Ensure all environment variables are properly configured before running the application.
- Refer to the `docker-compose.yml` file for service configurations.
- Stop the Docker containers with:
  ```bash
  docker-compose down
  ```