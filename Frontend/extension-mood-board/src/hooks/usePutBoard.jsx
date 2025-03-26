import { useState, useCallback } from "react";

export const useUpdateBoard = () => {
    const [updatedBoard, setUpdatedBoard] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState(null);
  
    const updateBoard = useCallback(async (boardId, updatedData) => {
      setIsUpdating(true);
      try {
        const res = await fetch(`http://localhost:3000/api/boards/${boardId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        });
        const data = await res.json();
        setUpdatedBoard(data);
        setIsUpdating(false);
      } catch (err) {
        setError(err);
        setIsUpdating(false);
      }
    }, []);
  
    return { updateBoard, updatedBoard, isUpdating, error };
  };