from fastapi import APIRouter, HTTPException
from models import UfcFighter
from db import collection

router = APIRouter()

@router.get("/fighters", response_model=list[UfcFighter])
def get_all_fighters():
    fighters = list(collection.find({}, {"_id": 0}))
    return fighters

@router.get("/fighter/{fighter_name}", response_model=UfcFighter)
def get_fighter(fighter_name: str):
    fighter = collection.find_one({"name": fighter_name.replace("-", " ")}, {"_id": 0})
    if not fighter:
        raise HTTPException(status_code=404, detail="Fighter not found")
    return fighter