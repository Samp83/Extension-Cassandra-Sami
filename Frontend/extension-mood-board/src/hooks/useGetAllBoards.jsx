import { useState, useEffect, useCallback } from "react";

export const useGetAllBoards = () => {
  const [boards, setBoards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBoards = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/boards/`);
      const data = await res.json();
      setBoards(data);
      setIsLoading(false);
      console.log("All boards", data);
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  return { boards, isLoading, error, refetch: fetchBoards };
};
