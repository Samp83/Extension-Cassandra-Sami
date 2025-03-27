import { useState, useCallback } from "react";

export const useCreateBoard = () => {
  const [createdBoard, setCreatedBoard] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  const createBoard = useCallback(async (title, description) => {
    setIsCreating(true);
    try {
      const res = await fetch("http://localhost:3000/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      const data = await res.json();
      setCreatedBoard(data);
      setIsCreating(false);
      return data;
    } catch (err) {
      setError(err);
      setIsCreating(false);
      return null;
    }
  }, []);

  return { createBoard, createdBoard, isCreating, error };
};