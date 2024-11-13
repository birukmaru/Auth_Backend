const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/auth_model");
const router = require("./routes/routes");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/", router);

mongoose
  .connect("mongodb://localhost:27017/BrakAuth")
  .then(() => console.log("DB connected successfully"))
  .catch((error) => console.log("DB fails to connect"));

const PORT = 1111;
app.listen(PORT, () => console.log(`Server runs in ${PORT}`));
