import { useState, useEffect } from "react";

export const useGetBoardById = (boardId) => {
    const [board, setBoard] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      if (!boardId) return;
      const fetchBoard = async () => {
        try {
          const res = await fetch(`http://localhost:3000/api/boards/${boardId}`);
          const data = await res.json();
          setBoard(data);
          setIsLoading(false);
        } catch (err) {
          setError(err);
          setIsLoading(false);
        }
      };
      fetchBoard();
    }, [boardId]);
  
    return { board, isLoading, error };
  };