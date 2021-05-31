const mongoose = require('mongoose');
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

module.exports = async (req, res, next) => {
  try {
    const token = req.query.key; //token == "4pf85865fj675010p"
    await user.findById(token, (err, data) => {
      if (!data) {
        res.status(400).json({ error: 'Invalid user ID!' });
      }
      next();
    });
  } 
  catch {
    res.status(400).json({ error: 'Invalid request!' });
  }
};