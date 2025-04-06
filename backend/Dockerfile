# Use Python for serving the backend
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend application code
COPY . .

# Copy the dummyData.json file to the container
# COPY dummyData.json /app/dummyData.json

# Expose the backend port
EXPOSE 8000

# Start the FastAPI backend
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
