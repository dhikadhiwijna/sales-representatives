from fastapi import APIRouter, HTTPException
from models.sales import SalesData, SalesRep
from utils.data_loader import load_sales_data

sales_router = APIRouter()

@sales_router.get("", response_model=SalesData)
async def get_sales_reps():
    """
    Retrieve all sales representatives data.
    """
    return load_sales_data()

@sales_router.get("/{rep_id}", response_model=SalesRep)
async def get_sales_rep(rep_id: int):
    """
    Retrieve a specific sales representative's data.
    """
    data = load_sales_data()
    for rep in data.salesReps:
        if rep.id == rep_id:
            return rep
    raise HTTPException(status_code=404, detail="Sales representative not found")
