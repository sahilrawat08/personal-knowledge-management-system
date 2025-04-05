// src/models/Flashcard.js
const mongoose = require('mongoose');

const FlashcardSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true
  },
  noteReference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  interval: {
    type: Number,
    default: 1 // Days until next review
  },
  easeFactor: {
    type: Number,
    default: 2.5 // Multiplier for interval
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  lastReviewed: {
    type: Date
  },
  nextReview: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to update review dates
FlashcardSchema.methods.processReview = function(quality) {
  // quality: 0-5 rating of how well the card was recalled
  // 0-2: Failed recall, 3-5: Successful recall
  
  this.reviewCount += 1;
  this.lastReviewed = new Date();
  
  // Implement SuperMemo-2 algorithm for spaced repetition
  if (quality < 3) {
    // Failed recall - reset interval
    this.interval = 1;
  } else {
    // Successful recall - increase interval
    if (this.reviewCount === 1) {
      this.interval = 1;
    } else if (this.reviewCount === 2) {
      this.interval = 6;
    } else {
      this.interval = Math.round(this.interval * this.easeFactor);
    }
    
    // Update ease factor based on quality
    this.easeFactor += (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (this.easeFactor < 1.3) this.easeFactor = 1.3;
  }
  
  // Calculate next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + this.interval);
  this.nextReview = nextReviewDate;
  
  return this;
};

module.exports = mongoose.model('Flashcard', FlashcardSchema);