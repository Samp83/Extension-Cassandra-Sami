import { useState, useCallback } from "react";

export const useCreateElement = () => {
  const [createdElement, setCreatedElement] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  const createElement = useCallback(async (type, content, posX, posY, width, height, boardId ) => {
    setIsCreating(true);
    try {
      const res = await fetch("http://localhost:3000/api/elements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, content, posX, posY, width , height, boardId }),
      });
      const data = await res.json();
      setCreatedElement(data);
      setIsCreating(false);
    } catch (err) {
      setError(err);
      setIsCreating(false);
    }
  }, []);

  return { createElement, createdElement, isCreating, error };
};