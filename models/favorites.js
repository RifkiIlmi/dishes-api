const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);

const Schema = mongoose.Schema;

const favoriteSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    dishes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish',
      },
    ],
  },
  {
    timestamps: true,
  }
);

let Favorites = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorites;
