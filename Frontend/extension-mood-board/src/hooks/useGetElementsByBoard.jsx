import { useState, useEffect } from "react";

export const useGetElementsByBoard = (boardId) => {
  const [elements, setElements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!boardId) return;

    const fetchElements = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/boards/${boardId}/elements`);
        const data = await res.json();
        setElements(data);
        setIsLoading(false);
        console.log("Elements for board:", boardId, data);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    fetchElements();
  }, [boardId]);

  return { elements, isLoading, error };
};
