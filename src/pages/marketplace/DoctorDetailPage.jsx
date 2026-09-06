import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDoctor } from "../../hooks/useDoctor";
import { useReviews } from "../../hooks/useReviews";
import { useOrders } from "../../hooks/useOrders";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";
import "./DoctorDetail.css";

const StarRating = ({ rating }) => (
  <span className="star-display">
    {[1,2,3,4,5].map(i => (
      <span key={i} style={{ color: i <= Math.round(rating) ? "#f59e0b" : "#e2e8f0", fontSize: "1.2rem" }}>★</span>
    ))}
  </span>
);

const ReviewForm = ({ onSubmit, submitting }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hovered, setHovered] = useState(0);
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await onSubmit({ rating, comment });
      setComment("");
      setRating(5);
    } catch (error) {
      setErr(error.message);
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h4>Write Your Review</h4>
      <div className="star-picker">
        {[1,2,3,4,5].map(i => (
          <span
            key={i}
            className={`star-pick ${i <= (hovered || rating) ? "active" : ""}`}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setRating(i)}
          >★</span>
        ))}
        <span className="rating-label">{rating}/5</span>
      </div>
      <textarea
        rows="3"
        placeholder="Share your experience with this therapist..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />
      {err && <div className="review-err">{err}</div>}
      <button type="submit" disabled={submitting} className="btn-submit-review">
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

const DoctorDetailPage = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { doctor, plans, loading, error } = useDoctor(doctorId);
  const { reviews, canReview, checkingEligibility, submitting, postReview } = useReviews(doctorId);
  const { purchaseDemoPlan, purchasing } = useOrders();
  const [purchaseResult, setPurchaseResult] = useState(null);
  const [purchaseError, setPurchaseError] = useState("");

  const handleDemoPurchase = async (plan) => {
    if (!user) {
      navigate(ROUTES.AUTH);
      return;
    }
    setPurchaseError("");
    try {
      const order = await purchaseDemoPlan({
        doctorUid: doctorId,
        doctorName: doctor?.displayName || doctor?.fullName,
        planId: plan.id,
        planTitle: plan.name,
        amount: plan.price,
      });
      setPurchaseResult(order);
    } catch (err) {
      setPurchaseError(err.message || "Purchase failed.");
    }
  };

  if (loading) return (
    <div className="detail-loading">
      <div className="detail-skeleton-header" />
      <div className="detail-skeleton-body" />
    </div>
  );

  if (error || !doctor) return (
    <div className="detail-not-found">
      <div>🔍</div>
      <h2>Therapist Not Found</h2>
      <p>This profile may not be available or has been removed.</p>
      <button onClick={() => navigate(ROUTES.TALK_TO_THERAPIST)} className="btn-back-market">
        ← Back to Marketplace
      </button>
    </div>
  );

  const avgRating = doctor.ratingSummary?.averageRating || 0;
  const reviewCount = doctor.ratingSummary?.reviewCount || 0;
  const distribution = doctor.ratingSummary?.ratingDistribution || {};

  return (
    <div className="detail-page">
      <button className="btn-back-market" onClick={() => navigate(ROUTES.TALK_TO_THERAPIST)}>
        ← Back to Therapists
      </button>

      <div className="detail-grid">
        {/* LEFT COLUMN */}
        <aside className="detail-sidebar">
          <div className="detail-avatar-card">
            {doctor.photoURL
              ? <img src={doctor.photoURL} alt={doctor.fullName} className="detail-avatar-img" />
              : (
                <div className="detail-avatar-initials">
                  {(doctor.fullName || "Dr").split(" ").map(w => w[0]).slice(0, 2).join("")}
                </div>
              )}
            <div className="detail-verified">✓ Verified Therapist</div>
            <h2>{doctor.displayName || doctor.fullName}</h2>
            <p className="detail-degree">{doctor.degree}</p>
            <p className="detail-spec">{doctor.specialization}</p>

            <div className="detail-rating-mini">
              <StarRating rating={avgRating} />
              <span>{avgRating > 0 ? avgRating.toFixed(1) : "New"} ({reviewCount} reviews)</span>
            </div>
          </div>

          <div className="detail-quick-facts">
            <div className="fact-item">
              <span className="fact-icon">🕐</span>
              <div>
                <span className="fact-label">Experience</span>
                <span className="fact-value">{doctor.experienceYears || 0} years</span>
              </div>
            </div>
            {doctor.location?.city && (
              <div className="fact-item">
                <span className="fact-icon">📍</span>
                <div>
                  <span className="fact-label">Location</span>
                  <span className="fact-value">{doctor.location.city}, {doctor.location.state || doctor.location.country}</span>
                </div>
              </div>
            )}
            {doctor.consultationMode && (
              <div className="fact-item">
                <span className="fact-icon">💬</span>
                <div>
                  <span className="fact-label">Consultation</span>
                  <span className="fact-value">{doctor.consultationMode}</span>
                </div>
              </div>
            )}
            {doctor.languages?.length > 0 && (
              <div className="fact-item">
                <span className="fact-icon">🌐</span>
                <div>
                  <span className="fact-label">Languages</span>
                  <span className="fact-value">{doctor.languages.join(", ")}</span>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* RIGHT COLUMN */}
        <main className="detail-main">
          {/* About */}
          <section className="detail-section">
            <h3>About {doctor.displayName || doctor.fullName}</h3>
            <p className="detail-bio">{doctor.bio || "No description provided."}</p>
          </section>

          {/* Plans */}
          <section className="detail-section">
            <h3>Consultation Plans</h3>
            {plans.length === 0 ? (
              <p className="detail-empty">No plans available yet.</p>
            ) : (
              <div className="plans-list">
                {plans.filter(p => p.active !== false).map(plan => (
                  <div key={plan.id} className="plan-detail-card">
                    <div className="plan-detail-info">
                      <h4>{plan.name}</h4>
                      <p>{plan.description}</p>
                      <div className="plan-detail-meta">
                        <span>⏱ {plan.duration}</span>
                        {plan.sessionsCount > 1 && <span>📋 {plan.sessionsCount} sessions</span>}
                      </div>
                      {plan.features?.length > 0 && (
                        <ul className="plan-features">
                          {plan.features.map((f, i) => <li key={i}>✓ {f}</li>)}
                        </ul>
                      )}
                    </div>
                    <div className="plan-detail-price-col">
                      <div className="plan-price-big">₹{plan.price}</div>
                      <div className="plan-currency">{plan.currency || "INR"}</div>
                      <button
                        className="btn-demo-purchase"
                        disabled={purchasing}
                        onClick={() => handleDemoPurchase(plan)}
                      >
                        {purchasing ? "Processing..." : "🛒 Demo Purchase"}
                      </button>
                      <span className="demo-label">⚡ Test Mode</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {purchaseResult && (
              <div className="purchase-success-box">
                <h4>✅ Demo Purchase Successful!</h4>
                <p><strong>Order ID:</strong> {purchaseResult.id}</p>
                <p><strong>Plan:</strong> {purchaseResult.planTitle}</p>
                <p><strong>Amount:</strong> ₹{purchaseResult.amount}</p>
                <p><strong>Status:</strong> {purchaseResult.status}</p>
                <p className="demo-notice">ℹ️ This is a demo/test order. No real payment was processed.</p>
              </div>
            )}
            {purchaseError && <div className="purchase-error-box">{purchaseError}</div>}
          </section>

          {/* Reviews */}
          <section className="detail-section">
            <h3>Reviews & Ratings</h3>

            {reviewCount > 0 && (
              <div className="rating-summary-grid">
                <div className="rating-big-num">{avgRating.toFixed(1)}</div>
                <div className="rating-details-col">
                  <StarRating rating={avgRating} />
                  <p>{reviewCount} review{reviewCount !== 1 ? "s" : ""}</p>
                  <div className="rating-distribution">
                    {[5,4,3,2,1].map(star => (
                      <div key={star} className="dist-row">
                        <span className="dist-label">{star}★</span>
                        <div className="dist-bar-bg">
                          <div
                            className="dist-bar-fill"
                            style={{ width: `${reviewCount > 0 ? ((distribution[star] || 0) / reviewCount * 100) : 0}%` }}
                          />
                        </div>
                        <span className="dist-count">{distribution[star] || 0}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Review Form */}
            {!user ? (
              <div className="review-login-prompt">
                <p>Please <button className="link-btn" onClick={() => navigate(ROUTES.AUTH)}>log in</button> to write a review.</p>
              </div>
            ) : checkingEligibility ? (
              <p className="review-checking">Checking review eligibility…</p>
            ) : canReview ? (
              <ReviewForm onSubmit={postReview} submitting={submitting} />
            ) : (
              <div className="review-ineligible">
                <p>🔒 Reviews are only available after purchasing a consultation plan from this therapist.</p>
              </div>
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <p className="detail-empty" style={{ marginTop: "16px" }}>No reviews yet. Be the first to share your experience!</p>
            ) : (
              <div className="reviews-list">
                {reviews.map(review => (
                  <div key={review.id} className="review-card">
                    <div className="review-card-header">
                      <div className="reviewer-avatar">
                        {(review.patientName || "P")[0].toUpperCase()}
                      </div>
                      <div>
                        <strong>{review.patientName || "Anonymous Patient"}</strong>
                        <div>
                          <StarRating rating={review.rating} />
                        </div>
                      </div>
                      <span className="review-date">
                        {review.createdAt?.toDate
                          ? review.createdAt.toDate().toLocaleDateString("en-IN")
                          : "Recent"}
                      </span>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default DoctorDetailPage;
