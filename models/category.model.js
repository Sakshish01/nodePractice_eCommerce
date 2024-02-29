const mongoose = require("mongoose"),
  { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    image: {
      type: String
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Category", categorySchema);
