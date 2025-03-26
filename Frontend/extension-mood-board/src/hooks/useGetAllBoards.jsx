import { useState, useEffect } from "react";

export const useGetAllBoards = () => {
    const [board, setBoard] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchBoards = async () => {
        try {
          const res = await fetch(`http://localhost:3000/api/boards/`);
          const data = await res.json();
          setBoard(data);
          setIsLoading(false);
          console.log("All boards", data);
        } catch (err) {
          setError(err);
          setIsLoading(false);
        }
      };
      fetchBoards();
    }, []);
  
    return { board, isLoading, error };
  };