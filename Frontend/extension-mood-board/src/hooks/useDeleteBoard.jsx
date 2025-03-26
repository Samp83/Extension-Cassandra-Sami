import { useState, useCallback } from "react";

export const useDeleteBoard = () => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);
    const [isDeleted, setIsDeleted] = useState(false);
  
    const deleteBoard = useCallback(async (boardId) => {
      setIsDeleting(true);
      try {
        await fetch(`http://localhost:3000/api/boards/${boardId}`, {
          method: "DELETE",
        });
        setIsDeleted(true);
        setIsDeleting(false);
      } catch (err) {
        setError(err);
        setIsDeleting(false);
      }
    }, []);
  
    return { deleteBoard, isDeleting, isDeleted, error };
  };