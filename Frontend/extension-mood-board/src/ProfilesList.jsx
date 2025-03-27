import { useGetAllProfiles } from "./hooks/useGetAllProfiles";
import { useCreateProfile } from "./hooks/useCreateProfile";
import { useUpdateProfile } from "./hooks/useUpdateProfile";
import { useDeleteProfile } from "./hooks/useDeleteProfile";
import { useCreateProfileBoardLink } from "./hooks/useCreateProfileBoardLink";
import { useGetAllBoards } from "./hooks/useGetAllBoards";
import { useState } from "react";

export default function ProfilesList({ onSelectProfile, refetchBoards, refetchProfiles }) {
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
    refetchProfiles();
    refetchBoards();
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 60,
        right: 10,
        width: "360px",
        bottom: 10,
        overflowY: "auto",
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 16,
        zIndex: 1000,
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
      }}
    >
      <h3 style={{ marginTop: 0 }}>👤 Profils</h3>

      <button
        onClick={handleCreate}
        style={{
          background: "#4caf50",
          color: "#fff",
          border: "none",
          padding: "6px 12px",
          borderRadius: 6,
          cursor: "pointer",
          marginBottom: 12,
          fontSize: 13,
        }}
      >
        ➕ Nouveau profil
      </button>

      {isLoading && <p>Chargement...</p>}
      {error && <p style={{ color: "red" }}>Erreur : {error.message}</p>}

      {profiles.map((profile) => {
        // boards déjà liés à ce profil
        const linkedIds = profile.boardLinks?.map((l) => l.boardId) || [];
        const unlinkedBoards = boards.filter((b) => !linkedIds.includes(b.id));

        return (
          <div
            key={profile.id}
            style={{
              borderBottom: "1px solid #eee",
              marginBottom: 16,
              paddingBottom: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <strong>{profile.nom}</strong>
              {profile.couleur && (
                <span
                  style={{
                    background: profile.couleur,
                    color: "#fff",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontSize: "11px",
                  }}
                >
                  {profile.couleur}
                </span>
              )}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
              <button
                onClick={() => onSelectProfile(profile)}
                style={btn("blue")}
              >
                ✅ Sélectionner
              </button>
              <button
                onClick={() => handleUpdate(profile)}
                style={btn("yellow")}
              >
                ✏️ Modifier
              </button>
              <button
                onClick={() => handleDelete(profile.id)}
                style={btn("red")}
              >
                🗑 Supprimer
              </button>
            </div>

            {/* Selecteur de board à lier */}
            <div style={{ marginTop: 8 }}>
              <select
                value={selectedBoardIdByProfile[profile.id] || ""}
                onChange={(e) =>
                  setSelectedBoardIdByProfile((prev) => ({
                    ...prev,
                    [profile.id]: e.target.value,
                  }))
                }
                style={{ width: "100%", padding: 6, borderRadius: 4 }}
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
                style={{ ...btn("gray"), marginTop: 6 }}
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
