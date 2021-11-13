const express = require('express')
const { MongoClient, Admin } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 4500

//user name niche11
//password EBkkB6cYIgtXNfeb


app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ox5tn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect()
    console.log('connected database');
    const database = client.db('products')
    const productsCollection = database.collection('productsCollection');
    const reviewCollecttion = database.collection('reviewCollecttion');
    const orderCollection = database.collection('orderCollection');
    const userCollection = database.collection('userCollection')



    //get product api
    app.get('/addproduct', async (req, res) => {
      const cursor = productsCollection.find({})
      const result = await cursor.toArray()
      res.send(result)
    })


    //get review api
    app.get('/addreview', async (req, res) => {
      const cursor = reviewCollecttion.find({})
      const result = await cursor.toArray()
      res.send(result)
    })


    //get single Order
    app.get("/addproduct/:id", async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const result = await productsCollection.findOne(query)
      res.send(result)
    })


    app.get("/myorder", async (req, res) => {
      let query = {}
      const email = req.query.email;
      if (email) {
        query = { email: email }
      }
      const cursor = await orderCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })

    //get admin api
    app.get('/user/:email', async(req, res)=> {
      const email = req.params.email
      const query = {email: email}
      const user = await userCollection.findOne(query)
      let isAdmin = false
      if(user?.role === 'admin'){
        isAdmin = true
      }   
      res.json({admin: isAdmin})
     })


    //post product api
    app.post('/addproduct', async (req, res) => {
      const newProduct = req.body
      const result = productsCollection.insertOne(newProduct)
      res.json(result)
    })


    // post review api
    app.post('/addreview', async (req, res) => {
      const newReview = req.body
      const result = reviewCollecttion.insertOne(newReview)
      res.json(result)
    })


    //post orders
    app.post('/myorder', async (req, res) => {
      const order = req.body
      const result = orderCollection.insertOne(order)
      res.json(result)
    })

    //post user api
    app.post('/user', async(req, res)=> {
      const user = req.body;
      console.log('post',user);
      const result = await userCollection.insertOne(user)
      res.json(result)     
    })
    
    // put user api
    app.put('/user',async(req, res)=> {
      const user = req.body
      const filter = {email: user.email}
      const options = {upsert: true}
      const updateDoc = {$set: user}
      const result = await userCollection.updateOne(filter, updateDoc, options)
      res.json(result)
    })
    app.put('/user/admin',async(req, res)=> {
      const user = req.body
      console.log('user post', user);
      const filter = {email: user.email}
      const updateDoc = {$set: {role: 'admin'}}
      const result = await userCollection.updateOne(filter, updateDoc)
      console.log(result);
      res.json(result)
    })

    //delete order api
    app.delete('/myorder/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const result = await orderCollection.deleteOne(query)
      res.json(result)
  })
    //delete product api
    app.delete('/addproduct/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const result = await productsCollection.deleteOne(query)
      console.log(result);
      res.json(result)
  })
    



  }
  finally {
    // await client.close()
  }
}

run().catch(console.dir)


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})