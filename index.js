const express = require("express");
const app = express();
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const auth = require("./middleware/auth");

mongoose.connect(
  "mongodb+srv://mukul7661:jO3kSq41pmPNNe56@cluster0.fbjoift.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/authenticate", authRoute);
app.use("/api", auth, userRoute);
app.use("/api/posts", auth, postRoute);

app.listen(8800, () => {
  console.log("Backend server is running!");
});

//  mongodb+srv://mukul7661:cakOL5xe9aADLXN7@cluster0.ncktzlo.mongodb.net/?retryWrites=true&w=majority
