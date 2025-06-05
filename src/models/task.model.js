const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'in progress', 'completed'],
    default: 'pending'
  },
  userId: { // Added userId field
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assumes your user model is named 'User'
    required: true
  }
}, {
  timestamps: true
});

// O campo `id` (“_id”) já vem incluso pelo Mongoose; se precisar expô-lo como “id”,
// você pode virtualizar:
// TaskSchema.virtual('id').get(function() { return this._id.toHexString(); });

module.exports = mongoose.model('Task', TaskSchema);
