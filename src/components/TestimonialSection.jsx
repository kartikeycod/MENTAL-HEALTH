// src/components/Testimonials.jsx
import React, { useState } from 'react';
import './Testimonials.css'; // 🚀 Import the dedicated CSS file

// Testimonials data (with identifiers for CSS avatars)
const ALL_TESTIMONIALS = [
  {
    avatarId: 'avatar-1', // Corresponds to a CSS class for avatar styling
    name: 'Sarah J.',
    rating: 5,
    text: '"MindEase has truly changed my life. The personalized therapy sessions and self-care tips are incredibly helpful. I feel heard and supported."',
  },
  {
    avatarId: 'avatar-2',
    name: 'Mark T.',
    rating: 5,
    text: '"The AI chatbot is surprisingly insightful, and the mood tracking helps me understand my patterns. A great tool for daily mental check-ins."',
  },
  {
    avatarId: 'avatar-3',
    name: 'Jessica L.',
    rating: 5,
    text: '"Connecting with a therapist has been seamless and incredibly effective. The platform\'s commitment to data security also puts my mind at ease."',
  },
  {
    avatarId: 'avatar-4',
    name: 'David K.',
    rating: 5,
    text: '"I appreciate the holistic approach, combining mindfulness with practical tools. It\'s a comprehensive platform that truly cares about well-being."',
  },
  // Adding a few more for the "Read More Reviews" functionality
  {
    avatarId: 'avatar-5',
    name: 'Emily R.',
    rating: 4,
    text: '"The guided meditations are a game-changer. I feel more centered and calm since I started using MindEase."',
  },
  {
    avatarId: 'avatar-6',
    name: 'Alex C.',
    rating: 5,
    text: '"Finally, a platform that makes mental health support accessible and easy to use. The progress tracking keeps me motivated!"',
  },
];

const TestimonialsSection = () => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5); // Default rating

  const displayedReviews = showAllReviews ? ALL_TESTIMONIALS : ALL_TESTIMONIALS.slice(0, 4);

  const handleReadMore = () => {
    setShowAllReviews(true);
  };

  const handleWriteReviewClick = () => {
    setShowWriteReview(true);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (reviewText.trim() && reviewerName.trim()) {
      alert(`Thanks for your review, ${reviewerName}! Rating: ${reviewRating} stars. Your feedback: "${reviewText}"`);
      // In a real app, you would send this to a backend API
      setReviewText('');
      setReviewerName('');
      setReviewRating(5);
      setShowWriteReview(false);
      setShowAllReviews(true); // Optionally show all reviews after submitting
    } else {
      alert('Please fill in your name and review text.');
    }
  };

  const renderStars = (rating) => {
    return Array(5).fill(null).map((_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>★</span>
    ));
  };

  return (
    <section className="testimonials-section">
      <div className="testimonials-header">
        <h2>What Our Patients Say</h2>
        <p>Hear directly from those who have experienced healing and growth with MindEase.</p>
      </div>

      <div className="testimonials-grid">
        {displayedReviews.map((testimonial, index) => (
          <div className="testimonial-card" key={index}>
            <div className="testimonial-author">
              <div className={`avatar ${testimonial.avatarId}`}></div> {/* CSS Avatar */}
              <div className="author-details">
                <h3 className="author-name">{testimonial.name}</h3>
                <div className="author-rating">
                  {renderStars(testimonial.rating)}
                </div>
              </div>
            </div>
            <p className="testimonial-text">{testimonial.text}</p>
          </div>
        ))}
      </div>

      {/* Buttons for Read More and Write a Review */}
      <div className="testimonials-actions">
        {!showAllReviews && ALL_TESTIMONIALS.length > 4 && (
          <button className="btn-read-more" onClick={handleReadMore}>
            Read More Reviews
          </button>
        )}
        <button className="btn-write-review" onClick={handleWriteReviewClick}>
          Write a Review
        </button>
      </div>

      {/* Write a Review Section */}
      {showWriteReview && (
        <div className="write-review-section">
          <h3>Share Your Experience</h3>
          <form onSubmit={handleSubmitReview}>
            <div className="form-group">
              <label htmlFor="reviewerName">Your Name:</label>
              <input
                type="text"
                id="reviewerName"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="reviewRating">Rating:</label>
              <select
                id="reviewRating"
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
              >
                {[5, 4, 3, 2, 1].map(num => (
                  <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="reviewText">Your Review:</label>
              <textarea
                id="reviewText"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows="5"
                required
              ></textarea>
            </div>
            <button type="submit" className="btn-submit-review">Submit Review</button>
            <button type="button" className="btn-cancel-review" onClick={() => setShowWriteReview(false)}>Cancel</button>
          </form>
        </div>
      )}
    </section>
  );
};

export default TestimonialsSection;