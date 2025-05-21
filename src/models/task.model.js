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
    enum: ['pendente', 'em progresso', 'concluída'],
    default: 'pendente'
  }
}, {
  timestamps: true
});

// O campo `id` (“_id”) já vem incluso pelo Mongoose; se precisar expô-lo como “id”,
// você pode virtualizar:
// TaskSchema.virtual('id').get(function() { return this._id.toHexString(); });

module.exports = mongoose.model('Task', TaskSchema);
