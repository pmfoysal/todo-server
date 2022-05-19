require('dotenv').config();
const cors = require('cors');
const express = require('express');
const {MongoClient, ServerApiVersion, ObjectId} = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d3xoe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1});

const corsOptions = {
   origin: '*',
};

app.use(express.json());
app.use(cors(corsOptions));

async function runDatabase() {
   try {
      await client.connect();
      const products = client.db('pmphas11').collection('products');
      const blogs = client.db('pmphas11').collection('blogs');
   } finally {
      // await client.close();
   }
}

runDatabase().catch(console.dir);

app.get('/', (req, res) => {
   res.send({status: 200, port, message: 'TodoApp Server is Running...'});
});

app.listen(port, () => {
   console.log(`TodoApp Server Running... Port: ${port}`);
});
