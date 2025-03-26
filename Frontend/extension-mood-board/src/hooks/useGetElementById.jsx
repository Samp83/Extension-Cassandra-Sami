import { useState, useEffect } from "react";

export const useGetElementById = (elementId) => {
    const [element, setlement] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      if (!elementId) return;
      const fetchlement = async () => {
        try {
          const res = await fetch(`http://localhost:3000/api/elements/${elementId}`);
          const data = await res.json();
          setlement(data);
          setIsLoading(false);
          console.log("element by id",data);
        } catch (err) {
          setError(err);
          setIsLoading(false);
        }
      };
      fetchlement();
    }, [elementId]);
  
    return { element, isLoading, error };
  };