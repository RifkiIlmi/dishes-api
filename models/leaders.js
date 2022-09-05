const mongoose = require("mongoose");
require("mongoose-currency").loadType(mongoose);
const Currency = mongoose.Types.Currency;

const Schema = mongoose.Schema;

const leaderSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      default: "",
    },
    abbr: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

let Leaders = mongoose.model("Leader", leaderSchema);

module.exports = Leaders;
