export default function Yoga() {
  return (
    <div
      style={{
        minHeight: "20vh",
        background: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Poppins, sans-serif"
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ color: "#0077b6", marginBottom: "25px" }}>
          Yoga & Motivation
        </h1>

        <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
          {/* Yoga Button */}
          <a
            href="https://www.yogajournal.com/poses"
            target="_blank"
            style={{
              padding: "12px 22px",
              background: "#0096c7",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "16px",
              whiteSpace: "nowrap"
            }}
          >
            🌿 Yoga Library
          </a>

          {/* Motivation Button */}
          <a
            href="https://zenquotes.io/"
            target="_blank"
            style={{
              padding: "12px 22px",
              background: "#00b4d8",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "16px",
              whiteSpace: "nowrap"
            }}
          >
            💡 Daily Motivation
          </a>
        </div>
      </div>
    </div>
  );
}
