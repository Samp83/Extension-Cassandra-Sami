import { useGetAllProfiles } from "./hooks/useGetAllProfiles";
import { useCreateProfile } from "./hooks/useCreateProfile";
import { useUpdateProfile } from "./hooks/useUpdateProfile";
import { useDeleteProfile } from "./hooks/useDeleteProfile";
import { useCreateProfileBoardLink } from "./hooks/useCreateProfileBoardLink";
import { useGetAllBoards } from "./hooks/useGetAllBoards";
import { useState } from "react";

export default function ProfilesList({ onSelectProfile }) {
  const { profile: profiles, isLoading, error, refetch } = useGetAllProfiles();
  const { boards } = useGetAllBoards();
  const { createProfile } = useCreateProfile();
  const { updateProfile } = useUpdateProfile();
  const { deleteProfile } = useDeleteProfile();
  const { linkBoardToProfile } = useCreateProfileBoardLink();
  const [selectedBoardIdByProfile, setSelectedBoardIdByProfile] = useState({});

  const handleCreate = async () => {
    const nom = prompt("Nom du profil :");
    const couleur = prompt("Couleur ou description ?");
    if (!nom) return;
    await createProfile(nom, couleur);
    refetch();
  };

  const handleUpdate = async (profile) => {
    const nom = prompt("Nouveau nom :", profile.nom);
    const couleur = prompt("Nouvelle couleur :", profile.couleur || "");
    if (!nom) return;
    await updateProfile(profile.id, { nom, couleur });
    refetch();
  };

  const handleDelete = async (profileId) => {
    const confirmDelete = confirm("Supprimer ce profil ?");
    if (!confirmDelete) return;
    await deleteProfile(profileId);
    refetch();
  };

  const handleLinkBoard = async (profileId) => {
    const boardId = selectedBoardIdByProfile[profileId];
    if (!boardId) return alert("Veuillez sélectionner un board.");
    await linkBoardToProfile(profileId, parseInt(boardId));
    alert(`Board ${boardId} lié avec succès.`);
    refetch();
  };

  return (
    <div>
      <h3>👤 Profils</h3>

      <button
        onClick={handleCreate}>
        ➕ Nouveau profil
      </button>

      {isLoading && <p>Chargement...</p>}
      {error && <p>Erreur : {error.message}</p>}

      {profiles.map((profile) => {
        // boards déjà liés à ce profil
        const linkedIds = profile.boardLinks?.map((l) => l.boardId) || [];
        const unlinkedBoards = boards.filter((b) => !linkedIds.includes(b.id));

        return (
          <div
            key={profile.id}>
            <div>
              <strong>{profile.nom}</strong>
              {profile.couleur && (
                <span>
                  {profile.couleur}
                </span>
              )}
            </div>

            <div>
              <button
                onClick={() => onSelectProfile(profile)}
              >
                ✅ Sélectionner
              </button>
              <button
                onClick={() => handleUpdate(profile)}>
                ✏️ Modifier
              </button>
              <button
                onClick={() => handleDelete(profile.id)}>
                🗑 Supprimer
              </button>
            </div>

            {/* Selecteur de board à lier */}
            <div>
              <select
                value={selectedBoardIdByProfile[profile.id] || ""}
                onChange={(e) =>
                  setSelectedBoardIdByProfile((prev) => ({
                    ...prev,
                    [profile.id]: e.target.value,
                  }))
                }
              >
                <option value="">🔗 Choisir un board à associer...</option>
                {unlinkedBoards.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title}
                  </option>
                ))}
              </select>
              <button
                onClick={() => handleLinkBoard(profile.id)}
              >
                Associer
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const btn = (color) => ({
  background:
    color === "red"
      ? "#e53935"
      : color === "blue"
      ? "#1976d2"
      : color === "yellow"
      ? "#fbc02d"
      : "#888",
  color: "#fff",
  border: "none",
  padding: "4px 8px",
  borderRadius: 4,
  cursor: "pointer",
  fontSize: 12,
});
