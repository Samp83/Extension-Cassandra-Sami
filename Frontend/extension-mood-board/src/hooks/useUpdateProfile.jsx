import { useState, useCallback } from "react";

export const useUpdateProfile = () => {
    const [updatedProfile, setupdatedProfile] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState(null);
  
    const updateProfile = useCallback(async (profileId, updatedData) => {
      setIsUpdating(true);
      try {
        const res = await fetch(`http://localhost:3000/api/profiles/${profileId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        });
        const data = await res.json();
        setupdatedProfile(data);
        setIsUpdating(false);
        console.log(`updated board ${profileId}`,data);
      } catch (err) {
        setError(err);
        setIsUpdating(false);
      }
    }, []);
  
    return { updateProfile, updatedProfile, isUpdating, error };
  };