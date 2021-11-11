const express = require('express')
const { MongoClient } = require('mongodb');
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
    const orderCollection = database.collection('orderCollection')


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


    //delete api
    app.delete('/myorder/:id', async (req, res) => {
      const id = req.params.id
      console.log(id);
      const query = { _id: ObjectId(id) }
      const result = await orderCollection.deleteOne(query)
      res.json(result)
  })
  //   app.delete('/addproduct/:id', async (req, res) => {
  //     const productid = req.params.productid
  //     console.log(productid);
  //     const query = { _id: ObjectId(productid) }
  //     const result = await productsCollection.deleteOne(query)
  //     res.json(result)
  // })



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