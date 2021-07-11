const mongoose = require("mongoose");
require('dotenv').config();
const db = process.env.mongoURI;
const connectDB = async()=>{
    try {
        await mongoose.connect(db,{useUnifiedTopology:true,useNewUrlParser:true,useCreateIndex:true, useFindAndModify: false});
        console.log("database is Connected")
    }catch(err){
        console.error(err.message);
        //Exit with failure
        process.exit(1)
    }
}

module.exports = connectDB;