import { useState, useEffect } from "react";

export const useGetAllElementsByBoard = () => {
    const [element, setElement] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchElements = async () => {
        try {
          const res = await fetch(`http://localhost:3000/api/elements/`);
          const data = await res.json();
          setElement(data);
          setIsLoading(false);
          console.log("All elements", data);
        } catch (err) {
          setError(err);
          setIsLoading(false);
        }
      };
      fetchElements();
    }, []);
  
    return { element, isLoading, error };
  };