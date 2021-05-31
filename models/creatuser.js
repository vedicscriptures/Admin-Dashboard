const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(() => console.log("connected to MONGO DB...")).catch(() => console.log(err));
// bhagavad gita chapter Schema
const userSchema = new mongoose.Schema({
    _id: String,
    name: String,
    mail: String,
    pass: String,
    start: {
      type: Date,
      default: Date.now
    },
    end: {
      type: Number,
      default: 365
    },
    count: Number,
});
// bhagavad gita models
const user = new mongoose.model("user", userSchema);
const userData= new user({
      _id: "4pf85865fj675010p",
      name: "Sagar Bhosale",
      mail: "sagarbhosale019@gmail.com",
      pass: "sagarbhosale019",
      count: 999,
});
userData.save(function (err, results) {
      console.log(results._id);
});

