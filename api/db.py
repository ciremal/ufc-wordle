import pymongo
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv('MONGO_URI')
MONGO_DATABASE = os.getenv('MONGO_DATABASE')
MONGO_COLLECTION = os.getenv('MONGO_COLLECTION')

client = pymongo.MongoClient(MONGO_URI, server_api=ServerApi('1'))
db = client[MONGO_DATABASE]
collection = db[MONGO_COLLECTION]