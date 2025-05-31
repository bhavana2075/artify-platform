const mongoose = require('mongoose');

const ArtworkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [{ type: String }],
  imageUrl: { type: String, required: true },
  artist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likedUsers: {
  type: [mongoose.Schema.Types.ObjectId],
  ref: 'User',
  default: []
},
likes: {
  type: Number,
  default: 0
},
// 👈 track users who liked
}, { timestamps: true });

module.exports = mongoose.model('Artwork', ArtworkSchema);
