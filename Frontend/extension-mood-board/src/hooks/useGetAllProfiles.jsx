import { useState, useEffect } from "react";

export const useGetAllProfiles = () => {
    const [profile, setProfile] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchProfiles = async () => {
        try {
          const res = await fetch(`http://localhost:3000/api/profiles/`);
          const data = await res.json();
          setProfile(data);
          setIsLoading(false);
          console.log("All profiles", data);
        } catch (err) {
          setError(err);
          setIsLoading(false);
        }
      };
      fetchProfiles();
    }, []);
  
    return { profile, isLoading, error };
  };