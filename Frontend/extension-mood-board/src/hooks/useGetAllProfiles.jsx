import { useState, useEffect } from "react";

export const useGetAllProfiles = () => {
  const [profile, setProfile] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfiles = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/profiles/`);
      const data = await res.json();
      setProfile(data);
      setIsLoading(false);
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return { profile, isLoading, error, refetch: fetchProfiles }; // ✅ expose le refetch
};