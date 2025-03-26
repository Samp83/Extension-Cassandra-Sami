import { useState, useEffect } from "react";

export const useGetBoardsByProfile = (profileId) => {
  const [boards, setBoards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!profileId) return;

    const fetchBoards = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/profiles/${profileId}/boards`);
        const data = await res.json();
        setBoards(data);
        setIsLoading(false);
        console.log("Boards for profile:", profileId, data);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    fetchBoards();
  }, [profileId]);

  return { boards, isLoading, error };
};
