const accountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    enum: ["asset", "liability", "income", "expense", "equity"],
    required: true,
  },

  // optional but powerful
  subtype: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

 
});