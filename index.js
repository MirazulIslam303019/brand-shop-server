const express=require('express');
const cors=require('cors');
const app=express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port=process.env.PORT || 2000;

app.use(cors());
app.use(express.json());




const uri = "mongodb+srv://brand-shop:JPaSAkm8YttgMlzo@cluster0.orljueh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const shoesCollection=client.db("brandDB").collection("brand");

    app.post('/brand',async(req,res)=>{
        const newbrand=req.body;
        console.log(newbrand);
        const result=shoesCollection.insertOne(newbrand);
        res.send(result)
    })
    app.get('/brand',async(req,res)=>{
        const cursor=shoesCollection.find();
        const result=await cursor.toArray();
        res.send(result)
    })

   app.delete('/brand/:id',async(req,res)=>{
        const id=req.params.id;
        const quary={_id:new ObjectId(id)}
        const result=await shoesCollection.deleteOne(quary);
        res.send(result)
   })

   app.get('/brand/:id',async(req,res)=>{
    const id=req.params.id;
    const quary={_id:new ObjectId(id)}
    const result=await shoesCollection.findOne(quary)
    res.send(result)
   })

   app.put('/brand/:id',async(req,res)=>{
       const id=req.params.id;
       const filter={_id:new ObjectId(id)}
       const options={upsert: true};
       const updateShoe=req.body;

       const shoe={
        $set:{
          name:updateShoe.name,
          brand:updateShoe.brand,
          type :updateShoe.type,
          price:updateShoe.price,
          description:updateShoe.description,
          rating:updateShoe.rating,
          photo:updateShoe.photo
          
        }
       }
       const result=await shoesCollection.updateOne(filter,shoe,options);
       res.send(result)
   })
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('A brand website is running')
})

app.listen(port,()=>[
    console.log(`Brand website is running port ${port}`)
])