# Sales Dashboard Backend

This is the FastAPI backend for the Sales Dashboard application.

## Setup

1. Create a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

## API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Endpoints

- GET `/api/data`: Get all sales representatives data
- GET `/api/data/{rep_id}`: Get a specific sales representative's data
- POST `api/ai`: Generate AI contents