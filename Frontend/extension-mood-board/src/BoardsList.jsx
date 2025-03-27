import { useGetAllProfiles } from "./hooks/useGetAllProfiles";
import { useGetBoardsByProfile } from "./hooks/useGetBoardsByProfile";
import { useUpdateBoard } from "./hooks/useUpdateBoard";
import { useDeleteBoard } from "./hooks/useDeleteBoard";

export default function BoardsList({
  visible,
  boards,
  isLoading,
  getAllBoardsError,
  refetch,
  onLoadBoard,
}) {
  const { profile: profiles, isLoading: loadingProfiles } = useGetAllProfiles();
  const { updateBoard } = useUpdateBoard();
  const { deleteBoard } = useDeleteBoard();

  if (!visible) return null;

  const handleUpdate = async (board) => {
    const newTitle = prompt("Nouveau titre :", board.title);
    const newDesc = prompt("Nouvelle description :", board.description);
    if (!newTitle) return;

    await updateBoard(board.id, {
      title: newTitle,
      description: newDesc,
    });

    refetch();
  };

  const handleDelete = async (boardId) => {
    const confirmDelete = confirm("Supprimer ce board ?");
    if (!confirmDelete) return;
    await deleteBoard(boardId);
    refetch();
  };

  // Regrouper tous les boardId liés à un profil
  const linkedBoardIds = new Set();
  profiles.forEach((profile) => {
    profile.boardLinks?.forEach((link) => {
      linkedBoardIds.add(link.boardId);
    });
  });

  // Filtrer les boards non classés
  const nonClassedBoards = boards.filter((b) => !linkedBoardIds.has(b.id));

  return (
    <div
      style={{
        position: "absolute",
        top: 60,
        left: 10,
        right: 10,
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
      <h3 style={{ marginTop: 0 }}>📋 Mes boards par profil</h3>

      {loadingProfiles && <p>Chargement des profils...</p>}
      {!loadingProfiles &&
        profiles
          .sort((a, b) => (a.nom === "Non classés" ? 1 : b.nom === "Non classés" ? -1 : 0))
          .map((profile) => (
            <ProfileBoardsGroup
              key={profile.id}
              profile={profile}
              onLoadBoard={onLoadBoard}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}

      {nonClassedBoards.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h4 style={{ borderBottom: "1px solid #ddd", paddingBottom: 4 }}>
            🗂 Non classés
          </h4>

          {nonClassedBoards.map((board) => (
            <BoardItem
              key={board.id}
              board={board}
              onLoadBoard={onLoadBoard}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileBoardsGroup({ profile, onLoadBoard, onUpdate, onDelete }) {
  const { boards, isLoading, error } = useGetBoardsByProfile(profile.id);

  return (
    <div style={{ marginBottom: 24 }}>
      <h4 style={{ borderBottom: "1px solid #ddd", paddingBottom: 4 }}>{profile.nom}</h4>

      {isLoading && <p style={{ fontSize: 13 }}>Chargement des boards...</p>}
      {error && <p style={{ color: "red" }}>Erreur : {error.message}</p>}

      {boards.map((board) => (
        <BoardItem
          key={board.id}
          board={board}
          onLoadBoard={onLoadBoard}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

function BoardItem({ board, onLoadBoard, onUpdate, onDelete }) {
  return (
    <div
      style={{
        border: "1px solid #eee",
        borderRadius: 6,
        padding: 8,
        marginBottom: 10,
        background: "#fafafa",
      }}
    >
      <p style={{ margin: 0 }}>
        <strong>{board.title}</strong>
      </p>
      <p style={{ margin: "4px 0", fontSize: 13 }}>{board.description}</p>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => onLoadBoard(board.id)} style={btn("green")}>
          📥 Charger
        </button>
        <button onClick={() => onUpdate(board)} style={btn("blue")}>
          ✏️ Modifier
        </button>
        <button onClick={() => onDelete(board.id)} style={btn("red")}>
          🗑 Supprimer
        </button>
      </div>
    </div>
  );
}

const btn = (color) => ({
  padding: "4px 8px",
  fontSize: 12,
  borderRadius: 4,
  border: "none",
  color: "#fff",
  background:
    color === "red" ? "#e53935" :
    color === "blue" ? "#1976d2" :
    color === "green" ? "#4caf50" : "#999",
  cursor: "pointer",
});
