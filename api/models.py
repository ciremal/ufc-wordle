from pydantic import BaseModel

class UfcFighter(BaseModel):
    name: str
    division:str
    record: list[int]
    status: str
    hometown: str
    age: int
    weight: float
    debut: str
    ko_tko: int
    dec: int
    sub: int
    standing: int
    clinch: int
    ground: int
    str_acc: str
    tkd_acc: str
    sig_str_landed: float
    sig_str_absorbed: float
    tkd_avg: float
    sub_avg: float
    sig_str_def: str
    tkd_def: str
    kd_avg: float
    avg_fight_time: str
     