require('dotenv').config();
const cors = require('cors');
const express = require('express');
const {MongoClient, ServerApiVersion, ObjectId} = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d3xoe.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1});

const corsOptions = {
   origin: '*',
};

app.use(express.json());
app.use(cors(corsOptions));

async function runDatabase() {
   try {
      await client.connect();
      const todos = client.db('todolist').collection('todos');

      app.get('/todos', async (req, res) => {
         const query = {};
         const data = await todos.find(query).toArray();
         res.send(data);
      });

      app.get('/todos/:id', async (req, res) => {
         const id = req.params.id;
         const query = {_id: ObjectId(id)};
         const data = await todos.findOne(query);
         res.send(data);
      });

      app.put('/todos/:id', async (req, res) => {
         const id = req.params.id;
         const newData = req.body;
         const filter = {_id: ObjectId(id)};
         const options = {upsert: true};
         const update = {$set: newData};
         const result = await todos.updateOne(filter, update, options);
         res.send(result);
      });

      app.delete('/todos/:id', async (req, res) => {
         const id = req.params.id;
         const query = {_id: ObjectId(id)};
         const result = await todos.deleteOne(query);
         res.send(result);
      });
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
