import os  # Add this import
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles  # Import StaticFiles
from routes.sales import sales_router
from routes.ai import ai_router

app = FastAPI(
    title="Sales Dashboard API",
    description="API for serving sales representatives data",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Next.js development server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(sales_router, prefix="/api/data", tags=["Sales"])
app.include_router(ai_router, prefix="/api/ai", tags=["AI"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Sales Dashboard API. Visit /docs for API documentation."}
