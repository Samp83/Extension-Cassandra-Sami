import { useState, useCallback } from "react";

export const useCreateProfile = () => {
  const [createdProfile, setcreatedProfile] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  const createProfile = useCallback(async (title,  description) => {
    setIsCreating(true);
    try {
      const res = await fetch("http://localhost:3000/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      const data = await res.json();
      setcreatedProfile(data);
      setIsCreating(false);
    } catch (err) {
      setError(err);
      setIsCreating(false);
    }
  }, []);

  return { createProfile, createdProfile, isCreating, error };
};