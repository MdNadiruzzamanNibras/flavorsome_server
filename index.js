const express = require('express')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://flavorsome:kF1ciM9JMkUiODMU@cluster0.degl89b.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run(req, res) {
  try {
    await client.connect();
      const menuCollection = client.db("menudata").collection("food");
      app.get('/menus', async(req,res)=>{
      const menus = await menuCollection.find({}).toArray();
    
      res.send(menus);
     
      })
      app.get('/menus/:id', async (req, res) => {
          const id =req.params.id 
     const qurey ={_id:ObjectId(id)}
     const  food= await menuCollection.findOne(qurey)
      res.send(food)
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