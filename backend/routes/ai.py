from fastapi import APIRouter, HTTPException, Request
from utils.data_loader import load_sales_data
import google.generativeai as gen_ai
import json
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

ai_router = APIRouter()

@ai_router.post("")
async def generate_ai_response(request: Request):
    """
    Generate a response from Google Gemini Pro AI based on the provided question and sales data.
    """
    try:
        body = await request.json()
        question = body.get("question")
        if not question:
            raise HTTPException(status_code=400, detail="Question is required")

        # Load sales data
        sales_data = load_sales_data()

        # Create the prompt with sales data
        sales_data_json = json.dumps(sales_data.dict(), indent=2)  # Convert to JSON string with indentation
        prompt = (
            "You are a sales analytics expert. Analyze the following sales data and respond to the question:\n\n"
            f"Sales Data: {sales_data_json}\n\n"
            f"Question: {question}"
        )

        # Configure the API key
        api_key = os.getenv("GOOGLE_API_KEY")  # Fetch the API key from environment variables
        if not api_key:
            raise HTTPException(status_code=500, detail="Google API key is not configured")
        gen_ai.configure(api_key=api_key)

        # Generate AI response
        model = gen_ai.GenerativeModel('gemini-1.5-flash')
        result = model.generate_content(prompt)
        response_text = result.text  # Assuming 'text' contains the generated response

        return {"response": response_text}
    except Exception as e:
        print("AI API Error:", e)
        raise HTTPException(status_code=500, detail="Failed to process AI request")
