import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { EventRoutes } from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 5000;
 
app.use(express.json())
app.use(cors());
app.use('/events', EventRoutes)
const Start = async () => {
  try {
    
    await mongoose.connect('mongodb+srv://azahqwerty:dlaasnEmLDBjHFGc@cluster0.thxbhsd.mongodb.net/?retryWrites=true&w=majority')
    
    app.listen(PORT, () => {
      console.log("Server is working");
    });
  } catch (e) {
    console.log(e);
  }
}

Start()