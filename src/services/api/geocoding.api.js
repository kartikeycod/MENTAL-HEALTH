export const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      { headers: { "User-Agent": "MentalHealthApp/1.0" } }
    );
    if (!response.ok) throw new Error("Location fetch failed");
    const data = await response.json();
    const city =
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      "Unknown";
    const country = data.address?.country || "";

    return {
      city,
      country,
      formattedLocation: `${city} (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`,
      cityCountry: `${city ? city + ", " : ""}${country}`,
    };
  } catch {
    return {
      city: "Unknown",
      country: "",
      formattedLocation: `(${latitude.toFixed(2)}, ${longitude.toFixed(2)})`,
      cityCountry: "",
    };
  }
};
