const express=require('express');
require('dotenv').config()
const mongoose=require("mongoose");
const Rooms=require("./dbRooms");
const app=express();
const cors_policy=require('cors');
const Messages = require('./dbMessages');
app.use(cors_policy());
const Pusher = require("pusher");
const pusher = new Pusher({
  appId: "1804951",
  key: "a2a220521cdcd39b2a2e",
  secret: "ed44e91c9af6a629669a",
  cluster: "ap2",
  useTLS: true
});

pusher.trigger("my-channel", "my-event", {
       message: "hello world"
});

mongoose.connect(process.env.DBURL)
       .then(()=>{
              app.listen(process.env.PORT,()=>{
                            console.log("DB connected and server is running")
              })
       })
       .catch((err)=>{
              console.log(err);
       })

const db=mongoose.connection;
app.use(express.json());
app.timeout=300000;

db.once("open",()=>{
       console.log("DB connected");
       // rooms
       const roomCollection=db.collection("rooms");
       const changeroomStream=roomCollection.watch();
       changeroomStream.on("change",(change)=>{
              if(change.operationType==="insert"){
                     const roomDetails=change.fullDocument;
                     pusher.trigger("room","inserted",roomDetails);

              } else{
                     console.log("Not expected event to trigger");
              }
       })

       // messages
       const msgCollection=db.collection("messages");
       const changemsgStream=msgCollection.watch();
       changemsgStream.on("change",(change)=>{
              if(change.operationType==="insert"){
                     const messageDetails=change.fullDocument;
                     pusher.trigger("messages","inserted",messageDetails);

              } else{
                     console.log("Not expected event to trigger");
              }
       })
});
app.get("/",(req,res)=>{
       res.send("Hello from backend");
})


app.post("/group/create", async (req,res)=>{
       const name=req.body.groupName;
       console.log(name);

       try{
              const new_rooms=new Rooms({
                     name
              })
              await new_rooms.save();
              res.status(200).send(name);
       }
       catch(err){
              console.log(err);
       }
})

app.delete('/deleteall',async (req,res)=>{
       try{
              const result=await Messages.deleteMany({});

              if (result.deletedCount>0){
                     return res.status(200).send("Records deleted successfully");
              }
              else{
                     return res.status(500).send("No records found");
              }
       }
       catch(err){
              console.log(err);
       }
})

app.post('/message/new',async (req,res)=>{
       const dbMessage=req.body;
       console.log(dbMessage);
       try {
              const Message=new Messages(dbMessage);
              await Message.save();
              res.status(200).send(dbMessage);
       } catch (error) {
             console.log(error); 
       }
})

app.get('/all/rooms',async(req,res)=>{
       try{
              const result=await Rooms.find({});
              res.json(result);
       }
       catch(err){
              res.status(500).send(err.message)
       }
})


app.get("/rooms/:id",async(req,res)=>{
       try{
              const result=await Rooms.find({_id:req.params.id});
              res.json(result[0]);
       }
       catch(err){
              res.status.send(err.message);
       }
})


app.get("/messages/:id",async(req,res)=>{
       try{
              console.log(req.params.id);
              const message=await Messages.find({roomId:req.params.id});
              
              console.log(message);
              res.json(message);
       }
       catch(err){
              console.log(err.message);
       }
})



