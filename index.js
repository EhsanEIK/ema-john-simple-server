const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fbieij7.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const productsCollection = client.db('emaJohnDB').collection('products');

        // products
        app.get('/products', async (req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const query = {};
            const cursor = productsCollection.find(query);
            const products = await cursor.skip(page * size).limit(size).toArray();
            const count = await productsCollection.estimatedDocumentCount();
            res.send({ count, products });
        })

        app.post('/productByIds', async (req, res) => {
            const ids = req.body;
            const objectIds = ids.map(id => ObjectId(id));
            const query = { _id: { $in: objectIds } };
            const cursor = productsCollection.find(query);
            const productByIds = await cursor.toArray();
            res.send(productByIds);
        })
    }
    finally { }
}
run().catch(error => console.error(error));


app.get('/', async (req, res) => {
    res.send('ema-john server is running');
})

app.listen(port, () => {
    console.log("server is running on port:", port);
})