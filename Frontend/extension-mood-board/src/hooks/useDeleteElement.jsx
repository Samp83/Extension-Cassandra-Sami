import { useState, useCallback } from "react";

export const useDeleteElement = () => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);
    const [isDeleted, setIsDeleted] = useState(false);
  
    const deleteElement = useCallback(async (elementId) => {
      setIsDeleting(true);
      try {
        await fetch(`http://localhost:3000/api/elements/${elementId}`, {
          method: "DELETE",
        });
        setIsDeleted(true);
        setIsDeleting(false);
        console.log(`deleted element ${elementId}`);
      } catch (err) {
        setError(err);
        setIsDeleting(false);
      }
    }, []);
  
    return { deleteElement, isDeleting, isDeleted, error };
  };