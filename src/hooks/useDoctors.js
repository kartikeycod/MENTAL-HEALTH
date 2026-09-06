import { useState, useEffect, useCallback } from "react";
import { getVerifiedDoctors } from "../services/firebase/doctorService";

export const useDoctors = (initialFilters = {}) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    specialization: "all",
    location: "",
    maxPrice: "",
    minExperience: 0,
    minRating: 0,
    sortBy: "rating",
    ...initialFilters,
  });

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getVerifiedDoctors(filters);
      setDoctors(list);
    } catch (err) {
      console.error("Error loading doctors marketplace:", err);
      setError("Unable to load doctors.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      specialization: "all",
      location: "",
      maxPrice: "",
      minExperience: 0,
      minRating: 0,
      sortBy: "rating",
    });
  };

  return {
    doctors,
    loading,
    error,
    filters,
    updateFilter,
    resetFilters,
    refresh: fetchDoctors,
  };
};
