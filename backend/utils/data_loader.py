import json
from pathlib import Path
from models.sales import SalesData

def load_sales_data() -> SalesData:
    """
    Load sales data from the JSON file.
    """
    base_dir = Path(__file__).resolve().parent.parent  # Get the project root directory
    data_file = base_dir /"data" / "dummyData.json"  # Path to the JSON file
    if not data_file.exists():
        raise FileNotFoundError(f"Data file not found: {data_file}")
    with open(data_file, "r") as f:
        return SalesData.model_validate(json.load(f))
