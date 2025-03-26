import { useGetAllBoards } from "./hooks/useGetAllBoards";
import { useUpdateBoard } from "./hooks/useUpdateBoard";
import { useDeleteBoard } from "./hooks/useDeleteBoard";

export default function BoardsList({ visible }) {
  const { board: boards, isLoading, error } = useGetAllBoards();
  const { updateBoard } = useUpdateBoard();
  const { deleteBoard } = useDeleteBoard();

  if (!visible) return null;

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
      <h3 style={{ marginTop: 0 }}>📋 Mes boards</h3>
      {isLoading && <p>Chargement...</p>}
      {error && <p style={{ color: "red" }}>Erreur : {error.message}</p>}
      {boards.map((board) => (
        <div
          key={board.id}
          style={{
            borderBottom: "1px solid #eee",
            marginBottom: 12,
            paddingBottom: 8,
          }}
        >
          <p>
            <strong>{board.title}</strong>
          </p>
          <p>{board.description}</p>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => {
                const newTitle = prompt("Nouveau titre :", board.title);
                const newDesc = prompt(
                  "Nouvelle description :",
                  board.description
                );

                // Vérifie que quelque chose a changé
                if (
                  newTitle === null ||
                  newDesc === null ||
                  (newTitle === board.title && newDesc === board.description)
                ) {
                  return;
                }

                updateBoard(board.id, {
                  title: newTitle,
                  description: newDesc,
                });
              }}
              style={{
                padding: "4px 8px",
                fontSize: 12,
                background: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              ✏️ Modifier
            </button>
            <button
              onClick={() => {
                const confirmDelete = confirm("Supprimer ce board ?");
                if (confirmDelete) {
                  deleteBoard(board.id);
                }
              }}
              style={{
                padding: "4px 8px",
                fontSize: 12,
                background: "#e53935",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
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
