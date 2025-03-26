import { useState, useCallback } from "react";

export const useCreateProfileBoardLink = () => {
  const [linkedBoard, setLinkedBoard] = useState(null);
  const [isLinking, setIsLinking] = useState(false);
  const [error, setError] = useState(null);

  const linkBoardToProfile = useCallback(async (profileId, boardId) => {
    setIsLinking(true);
    try {
      const res = await fetch(`http://localhost:3000/api/profiles/${profileId}/boards/${boardId}`, {
        method: "POST",
      });

      const data = await res.json();
      setLinkedBoard(data);
      setIsLinking(false);
    } catch (err) {
      setError(err);
      setIsLinking(false);
    }
  }, []);

  return { linkBoardToProfile, linkedBoard, isLinking, error };
};
