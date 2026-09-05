export const fetchNearbyCounsellors = async (lat, lon) => {
  const queryStr = `
    [out:json];
    (
      node["healthcare"="psychotherapist"](around:3000,${lat},${lon});
      node["healthcare"="psychology"](around:3000,${lat},${lon});
      node["amenity"="clinic"](around:3000,${lat},${lon});
    );
    out body;
  `;

  const url =
    "https://overpass-api.de/api/interpreter?data=" +
    encodeURIComponent(queryStr);

  const res = await fetch(url);
  const data = await res.json();

  return (data.elements || []).map((e) => ({
    id: e.id,
    name: (e.tags && e.tags.name) || "Certified Counsellor",
    specialization:
      (e.tags && (e.tags.specialty || e.tags.healthcare)) ||
      "Mental Health",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${e.id}`,
    rating: (4 + Math.random()).toFixed(1),
  }));
};
