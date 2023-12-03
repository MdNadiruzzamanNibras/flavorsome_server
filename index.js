const express = require('express')
const bodyParser = require("body-parser");
require('dotenv').config()
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000

app.use(bodyParser.json());
app.use(cors())
app.use(express.json())
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.degl89b.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
     client.connect();
      const menuCollection = client.db("menudata").collection("food");
      const userCollection = client.db("menudata").collection("user");
      const bookCollection = client.db("menudata").collection("table");
      app.get('/menus', async(req,res)=>{
      const menus = await menuCollection.find({}).toArray();
    
      res.send(menus);
     
      })
      app.get('/menus/:id', async (req, res) => {
          const id = req.params.id 
      
          const qurey = { _id: new ObjectId(id) }
          
          const food = await menuCollection.findOne(qurey)
        
      res.send(food)
  })
    
    //USER
    app.get('/user', async (req, res) => {
      const user = await userCollection.find({}).toArray()
     
      res.send(user)
    })
  app.post('/user', async (req, res) => {
  const user = req.body;
  const result = await userCollection.insertOne(user);
  res.send(result);
  });
    
    // Book Table all route
    
    app.post('/book', async (req, res) => {
      const booktable = req.body
      const result = await bookCollection.insertOne(booktable)
      res.send(result)
    })
  } finally {
    // Ensure that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})