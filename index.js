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
      const orderCollection = client.db("menudata").collection("order");
    const reviewCollection = client.db("menudata").collection("review");
    
    app.post('/addFood', async (req, res) => {
  const menus = req.body;
      const result = await menuCollection.insertOne(menus);
     
  res.send(result);
  });
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
    // Review 
    app.get('/allreview', async(req,res)=>{
      const reviews = await reviewCollection.find({}).toArray();
    
      res.send(reviews);
     
      })
app.post('/review', async (req, res) => {
  const review = req.body;
  const result = await reviewCollection.insertOne(review);
  res.send(result);
  });
    
    //USER
    app.get('/admin/:email', async (req, res) => {
    const email = req.params.email;
      const user = await userCollection.findOne({ email: email });
      const isAdmin = user?.role === 'admin';
    res.send({ admin: isAdmin })
    
  })
    app.get('/profile/:email', async (req, res) => {
    const email = req.params.email;
      const user = await userCollection.findOne({ email: email });
     
    res.send(user)
    
  })
    app.get('/user', async (req, res) => {
      const user = await userCollection.find({}).toArray()
     
      res.send(user)
    })
  app.post('/user', async (req, res) => {
  const user = req.body;
  const result = await userCollection.insertOne(user);
  res.send(result);
  });
    app.put('/update/:email', async (req, res) => {
  const { email } = req.params; 
  const updateUser = req.body; 

      const result = await userCollection.updateOne({ email:email },
        { $set: updateUser },
      { upsert: true });
    
     
     res.send(result)
  
});
    
    
    // order

    app.get('/order', async (req, res) => {
      const orders =await orderCollection.find({}).toArray()
      res.send(orders)
    })
    app.get('/myorder/:email', async (req, res) => {
      const email = req.params.email
      console.log(email);
      const orders =await orderCollection.find({email: email}).toArray()
      res.send(orders)
    })
  app.post('/order', async (req, res) => {
  const orders = req.body;
    const result = await orderCollection.insertOne(orders);
    console.log(result);
  res.send(result);
  });
    
    // Book Table all route 
    app.get('/book', async (req, res) => {
      const books =await bookCollection.find({}).toArray()
      res.send(books)
    })
    app.get('/mybook/:email', async (req, res) => {
      const email = req.params.email;
      const books = await bookCollection.find({ email: email }).toArray()

      res.send(books)
    })
    app.post('/book', async (req, res) => {
      const booktable = req.body
      const result = await bookCollection.insertOne(booktable)
      res.send(result)
    })
  } finally {
    // Ensure that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})