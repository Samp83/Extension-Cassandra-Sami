import { useGetAllProfiles } from "./hooks/useGetAllProfiles";
import { useCreateProfile } from "./hooks/useCreateProfile";
import { useUpdateProfile } from "./hooks/useUpdateProfile";
import { useDeleteProfile } from "./hooks/useDeleteProfile";

export default function ProfilesList({ onSelectProfile }) {
  const { profile: profiles, isLoading, error } = useGetAllProfiles();
  const { createProfile } = useCreateProfile();
  const { updateProfile } = useUpdateProfile();
  const { deleteProfile } = useDeleteProfile();

  const handleCreate = async () => {
    const nom = prompt("Nom du profil :");
    const couleur = prompt("Couleur ou description ?");
    if (!nom) return;
    await createProfile(nom, couleur);
  };

  const handleUpdate = async (profile) => {
    const nom = prompt("Nouveau nom :", profile.nom);
    const couleur = prompt("Nouvelle description :", profile.couleur || "");
    if (!nom) return;
    await updateProfile(profile.id, { nom, couleur });
  };

  const handleDelete = async (profileId) => {
    const confirmDelete = confirm("Supprimer ce profil ?");
    if (!confirmDelete) return;
    await deleteProfile(profileId);
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 60,
        right: 10,
        width: "300px",
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

      {profiles.map((profile) => (
        <div
          key={profile.id}
          style={{
            borderBottom: "1px solid #eee",
            marginBottom: 12,
            paddingBottom: 8,
          }}
        >
          <strong>{profile.nom}</strong>
          <p style={{ fontSize: 13 }}>{profile.couleur || "Aucune description"}</p>

          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => onSelectProfile(profile)}
              style={{
                background: "#1976d2",
                color: "#fff",
                padding: "4px 8px",
                borderRadius: 4,
                border: "none",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              ✅ Sélectionner
            </button>
            <button
              onClick={() => handleUpdate(profile)}
              style={{
                background: "#fbc02d",
                color: "#000",
                padding: "4px 8px",
                borderRadius: 4,
                border: "none",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              ✏️ Modifier
            </button>
            <button
              onClick={() => handleDelete(profile.id)}
              style={{
                background: "#e53935",
                color: "#fff",
                padding: "4px 8px",
                borderRadius: 4,
                border: "none",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              🗑 Supprimer
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
