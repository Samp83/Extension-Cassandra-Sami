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
    <div>
      <h3>📋 Mes boards par profil</h3>

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
        <div>
          <h4>
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
    <div >
      <h4>{profile.nom}</h4>

      {isLoading && <p>Chargement des boards...</p>}
      {error && <p>Erreur : {error.message}</p>}

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
    <div>
      <p>
        <strong>{board.title}</strong>
      </p>
      <p>{board.description}</p>

      <div>
        <button onClick={() => onLoadBoard(board.id)}>
          📥 Charger
        </button>
        <button onClick={() => onUpdate(board)}>
          ✏️ Modifier
        </button>
        <button onClick={() => onDelete(board.id)}>
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
