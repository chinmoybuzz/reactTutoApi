const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
// const mysql = require("mysql2");

const DATABASE_URL = process.env.DATABASE_URL;

const connectMongo = async () => {
  try {
    mongoose.set("runValidators", true);
    await mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Mongo Database Connected to : ${DATABASE_URL}`);
  } catch (error) {
    console.error("MongoDB Connection Error: ", error);
  }
};

// const connectMql = () => {
//   try {
//     const connection = mysql
//       .createPool({
//         host: "localhost",
//         user: "root",
//         password: "root",
//         database: "notes_app",
//       })
//       .promise();

//     return connection;
//   } catch (error) {
//     console.error("Error connecting to MySQL:", error.message);
//     throw error; // You might want to handle the error or log it appropriately
//   }
// };

module.exports = { connectMongo };
