require("dotenv").config();
const {Client} = require('pg');
const connectDB = async () => {
    try {
        const client = new Client({
            host:process.env.DATABASE_HOST,
            user:process.env.DATABASE_USERNAME,
            port:process.env.DATABASE_PORT,
            password:process.env.DATABASE_PASSWORD,
            database:process.env.DATABASE_DATABASE
        })

       if(client.connect()){
        console.log("Database connected successfully");
       }
       
    } catch (err) {
        console.log("Error connecting Database:",err);
    }
}

module.exports={
    connectDB,
};