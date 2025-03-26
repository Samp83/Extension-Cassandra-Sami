import { useState, useCallback } from "react";

export const useDeleteProfile = () => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);
    const [isDeleted, setIsDeleted] = useState(false);
  
    const deleteProfile = useCallback(async (profileId) => {
      setIsDeleting(true);
      try {
        await fetch(`http://localhost:3000/api/profiles/${profileId}`, {
          method: "DELETE",
        });
        setIsDeleted(true);
        setIsDeleting(false);
        console.log(`deleted profile ${profileId}`);
      } catch (err) {
        setError(err);
        setIsDeleting(false);
      }
    }, []);
  
    return { deleteProfile, isDeleting, isDeleted, error };
  };