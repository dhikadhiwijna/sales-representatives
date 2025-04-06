from pydantic import BaseModel
from typing import List

class Deal(BaseModel):
    client: str
    value: float
    status: str

class Client(BaseModel):
    name: str
    industry: str
    contact: str

class SalesRep(BaseModel):
    id: int
    name: str
    role: str
    region: str
    deals: List[Deal]
    skills: List[str]
    clients: List[Client]

class SalesData(BaseModel):
    salesReps: List[SalesRep]
