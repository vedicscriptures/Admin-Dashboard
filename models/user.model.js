const mongoose = require('mongoose');

    // User Schema
    const userSchema = new mongoose.Schema({
        _id: String,
        name: {
            type: String,
            unique: true
          },
        mail: {
            type: String,
            unique: true
          },
        pass: String,
        start: String,
        end: Number,
        count: Number,
    });
	
	// user models
	const user = new mongoose.model("user", userSchema);
	
module.exports = user;
