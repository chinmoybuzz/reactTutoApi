const express = require("express");
const helmet = require("helmet");
const connectDb = require("./db/connect");
const apiV1Route = require("./routes/api.v1.route");

const PORT = process.env.PORT || 9000;
const app = express();
const cors = require("cors");

// require("./strategies/JWTStrategy");

app.use(cors());
app.use(helmet());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(express.json());
app.use(express.static("public"));
const start = async () => {
  connectDb.connectMongo();
  app.listen(PORT, () => {
    console.log(`Server Started at : http://localhost:${PORT}`);
  });
};

app.use("/api/v1", apiV1Route);

start();
