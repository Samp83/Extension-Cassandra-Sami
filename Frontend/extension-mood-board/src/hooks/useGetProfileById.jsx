import { useState, useEffect } from "react";

export const useGetProfileById = (profileId) => {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      if (!profileId) return;
      const fetchProfile = async () => {
        try {
          const res = await fetch(`http://localhost:3000/api/profiles/${profileId}`);
          const data = await res.json();
          setProfile(data);
          setIsLoading(false);
          console.log("profile by id",data);
        } catch (err) {
          setError(err);
          setIsLoading(false);
        }
      };
      fetchProfile();
    }, [profileId]);
  
    return { profile, isLoading, error };
  };