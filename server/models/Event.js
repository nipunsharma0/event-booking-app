import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({

  picture: {
    type: String,
    require: true
  },

  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Music', 'Sports', 'Technology', 'Arts', 'Food & Drink', 'Other'], 
  },
  date: {
    type: Date,
    required: true,
  },
  venue: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  maxSeats: {
    type: Number,
    required: true,
    min: 1,
  },
  bookedSeats: {
    type: Number,
    default: 0,
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  }
}, {
  timestamps: true,
});

const Event = mongoose.model('Event', eventSchema);

export default Event;