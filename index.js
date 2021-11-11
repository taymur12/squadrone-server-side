const express = require('express')
const { MongoClient, ObjectId } = require('mongodb');
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000

//dotenv
require('dotenv').config()

//MIDDLEwERE
app.use(cors())
app.use(express.json())

//mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o7kpe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        console.log('SquaDrone Server is running')
        const database = client.db("SquaDrone")
        const products = database.collection("products")

        //get products
        app.get('/products', async (req, res) => {
            const cursor = products.find({})
            const product = await cursor.toArray();
            res.json(product)
        })

        //get single products
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await products.findOne(query)
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
    console.log(`Example app listening at, ${port}`)
})