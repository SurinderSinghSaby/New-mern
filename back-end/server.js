const express = require("express");
const bodyParser = require("body-parser");
const HttpError = require("./errors/http-error");
const mongoose = require("mongoose");

const app = express();

//importing routes
const jobRoutes = require("./routes/job-route");
const userRoutes = require("./routes/user-route");

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // * => allow all domains
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization" // allow these headers
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE"); // allow these methods
  next();
});

// => /api/jobs...
app.use("/api/jobs", jobRoutes);
// => /api/users...
app.use("/api/user", userRoutes);

app.use((req, res, next) => {
  const error = new Error("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if(res.headerSent){
    return next(error);
  }
  res.status(error.code || 500)
  res.json({message: error.message || 'An unknown error occurred!'});
});

mongoose
.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.orpjczc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
.then(() => {
  app.listen(3001);
})
.catch(err =>{
  console.log(err);
}); 