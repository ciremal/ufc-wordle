import pymongo
from pymongo.server_api import ServerApi

class UfcscraperPipeline:
    def __init__(self, mongo_uri, mongo_db, mongo_collection):
        self.mongo_uri = mongo_uri
        self.mongo_db = mongo_db
        self.mongo_collection = mongo_collection

    @classmethod
    def from_crawler(cls, crawler):
        # Get values from settings.py
        return cls(
            mongo_uri=crawler.settings.get("MONGO_URI"),
            mongo_db=crawler.settings.get("MONGO_DATABASE", "ufc"),
            mongo_collection=crawler.settings.get("MONGO_COLLECTION", "fighter_info")
        )

    # When the spider opens, connect to the MongoDB database
    def open_spider(self, spider):
        self.client = pymongo.MongoClient(self.mongo_uri, server_api=ServerApi('1'))
        self.db = self.client[self.mongo_db]
        self.collection = self.db[self.mongo_collection]

    # Once the spider finishes execution, close the connection to the database
    def close_spider(self, spider):
        self.client.close()

    def process_item(self, item, spider):
        string_fields = ["division", "status", "hometown", "fighting_style", "debut", "str_acc","tkd_acc","sig_str_def","tkd_def", "avg_fight_time", "rank"]
        number_fields = ["age", "height", "weight", "reach", "leg_reach", "ko_tko", "dec", "sub", "standing", "clinch", "ground", "sig_str_landed", "sig_str_absorbed", "tkd_avg", "sub_avg", "kd_avg"]

        for field in item.fields:
            if field in string_fields: item.setdefault(field, '')
            if field in number_fields: item.setdefault(field, 0)
            if field == 'record': item.setdefault(field, [0,0,0])
        # self.collection.insert_one(dict(item))
        return item
