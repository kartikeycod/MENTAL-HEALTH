import React from "react";
import { useDoctors } from "../../hooks/useDoctors";
import { useNavigate, Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import "./Marketplace.css";

const SPECIALIZATIONS = [
  "all", "Clinical Psychologist", "Psychiatrist", "Counseling Psychologist",
  "Cognitive Behavioral Therapist", "Child & Adolescent Therapist", "Mindfulness & Stress Specialist"
];

const StarRating = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className="star-display">
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= full ? "#f59e0b" : (i === full + 1 && half ? "#f59e0b" : "#e2e8f0") }}>★</span>
      ))}
    </span>
  );
};

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();
  return (
    <div className="doctor-market-card" onClick={() => navigate(`/therapists/${doctor.id}`)}>
      <div className="dmc-avatar">
        {doctor.photoURL
          ? <img src={doctor.photoURL} alt={doctor.fullName} />
          : <div className="dmc-avatar-initials">{(doctor.fullName || "Dr").split(" ").map(w => w[0]).slice(0, 2).join("")}</div>}
        <div className="dmc-verified-badge">✓ Verified</div>
      </div>

      <div className="dmc-info">
        <h3>{doctor.displayName || doctor.fullName}</h3>
        <p className="dmc-degree">{doctor.degree}</p>
        <p className="dmc-spec">{doctor.specialization}</p>

        <div className="dmc-meta-row">
          <span>🕐 {doctor.experienceYears || 0} yrs exp</span>
          {doctor.location?.city && <span>📍 {doctor.location.city}</span>}
          {doctor.consultationMode && <span>💬 {doctor.consultationMode}</span>}
        </div>

        {doctor.languages?.length > 0 && (
          <p className="dmc-langs">🌐 {doctor.languages.join(", ")}</p>
        )}

        <p className="dmc-bio">{(doctor.bio || "").slice(0, 100)}{doctor.bio?.length > 100 ? "…" : ""}</p>

        <div className="dmc-footer">
          <div className="dmc-rating">
            <StarRating rating={doctor.ratingSummary?.averageRating || 0} />
            <span>({doctor.ratingSummary?.reviewCount || 0} reviews)</span>
          </div>
          <div className="dmc-price">
            Starting from <strong>₹{doctor.startingPrice || "—"}</strong>
          </div>
        </div>

        <button className="dmc-cta-btn">View Profile & Book</button>
      </div>
    </div>
  );
};

const MarketplacePage = () => {
  const { doctors, loading, error, filters, updateFilter, resetFilters } = useDoctors();

  return (
    <div className="marketplace-page">
      {/* Hero Banner */}
      <div className="marketplace-hero">
        <div className="marketplace-hero-inner">
          <h1>Find Your Therapist</h1>
          <p>Browse verified, certified mental health professionals. Book a session in minutes.</p>
          <div className="marketplace-hero-ctas">
            <Link to={ROUTES.DOCTOR_LOGIN} className="mh-btn-outline">Doctor Login</Link>
            <Link to={ROUTES.DOCTOR_SIGNUP} className="mh-btn-outline">Join as Therapist</Link>
          </div>
        </div>
      </div>

      <div className="marketplace-body">
        {/* Filters Sidebar */}
        <aside className="marketplace-filters">
          <div className="filter-header">
            <h3>Filters</h3>
            <button onClick={resetFilters} className="btn-reset-filters">Reset</button>
          </div>

          <div className="filter-group">
            <label>Search Doctor</label>
            <input
              type="text"
              placeholder="Name, bio, specialization..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>📍 Location / City</label>
            <input
              type="text"
              placeholder="Filter by city, state, address..."
              value={filters.location}
              onChange={(e) => updateFilter("location", e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>💰 Max Starting Price (₹)</label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 1000"
              value={filters.maxPrice}
              onChange={(e) => updateFilter("maxPrice", e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Specialization</label>
            <select
              value={filters.specialization}
              onChange={(e) => updateFilter("specialization", e.target.value)}
            >
              {SPECIALIZATIONS.map(s => (
                <option key={s} value={s}>{s === "all" ? "All Specializations" : s}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Min Experience (years)</label>
            <input
              type="number"
              min="0"
              max="40"
              value={filters.minExperience}
              onChange={(e) => updateFilter("minExperience", e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Min Rating</label>
            <select value={filters.minRating} onChange={(e) => updateFilter("minRating", e.target.value)}>
              <option value={0}>Any Rating</option>
              <option value={3}>3+ Stars</option>
              <option value={4}>4+ Stars</option>
              <option value={4.5}>4.5+ Stars</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select value={filters.sortBy} onChange={(e) => updateFilter("sortBy", e.target.value)}>
              <option value="rating">Highest Rated</option>
              <option value="experience">Most Experienced</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </aside>

        {/* Doctor Grid */}
        <main className="marketplace-grid-area">
          {loading ? (
            <div className="marketplace-loading">
              {[1,2,3,4].map(i => <div key={i} className="skeleton-card" />)}
            </div>
          ) : error ? (
            <div className="marketplace-empty">
              <div className="empty-icon">⚠️</div>
              <p>{error}</p>
            </div>
          ) : doctors.length === 0 ? (
            <div className="marketplace-empty">
              <div className="empty-icon">🔍</div>
              <h3>No therapists found</h3>
              <p>Try adjusting your search filters.</p>
              <button onClick={resetFilters} className="btn-reset-filters big">Clear Filters</button>
            </div>
          ) : (
            <>
              <p className="results-count">{doctors.length} verified therapist{doctors.length !== 1 ? "s" : ""} found</p>
              <div className="marketplace-grid">
                {doctors.map(doc => <DoctorCard key={doc.id} doctor={doc} />)}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default MarketplacePage;
