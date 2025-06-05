from fastapi import FastAPI, HTTPException
from models import UfcFighter
from db import collection

app = FastAPI()

items = []

@app.get("/fighter/{fighter_name}", response_model=UfcFighter)
async def get_fighter(fighter_name: str) -> UfcFighter:
    fighter = collection.find_one(
        {"name": fighter_name.replace("-"," ")}, 
        {"_id": False}
    )
    if fighter:
        return fighter
    else:
        raise HTTPException(status_code=404, detail="Fighter not found")

@app.get("/fighters")
async def get_fighters() -> list[UfcFighter]:
    return list(collection.find({}, {"_id": False}))