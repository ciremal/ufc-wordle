const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion } = require("mongodb");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 8000;

let collection;

const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectDB() {
  try {
    await client.connect();
    const db = client.db(process.env.MONGO_DATABASE);
    collection = db.collection(process.env.MONGO_COLLECTION);
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
}

app.get("/", (req, res) => {
  res.send("Connected to my UFC API");
});

app.get("/fighter/:name", async (req, res) => {
  const name = req.params.name;
  try {
    const fighter = await collection.findOne(
      { name: name.replace("-", " ") },
      { projection: { _id: 0 } }
    );
    if (fighter) {
      res.json(fighter);
    } else {
      res.status(404).json({ message: "Fighter not found" });
    }
  } catch (error) {
    console.error(error);
  }
});

app.get("/fighters", async (req, res) => {
  try {
    const fighters = await collection.find().toArray();
    res.json(fighters);
  } catch (error) {
    console.error(error);
  }
});

connectDB();

app.listen(port, () => {
  console.log("Listening on port");
});
