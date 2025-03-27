import { useEffect, useRef, useState } from "react";
import { useCreateBoard } from "./hooks/useCreateBoard";
import { useCreateElement } from "./hooks/useCreateElement";
import { useGetAllBoards } from "./hooks/useGetAllBoards";
import { useCreateProfileBoardLink } from "./hooks/useCreateProfileBoardLink";
import { useGetAllProfiles } from "./hooks/useGetAllProfiles";
import BoardsList from "./BoardsList";
import ProfilesList from "./ProfilesList";

function App() {
  const [items, setItems] = useState([]);
  const [showBoards, setShowBoards] = useState(false);
  const [showProfiles, setShowProfiles] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const containerRef = useRef(null);

  const { boards, isLoading, error: getAllBoardsError, refetch } = useGetAllBoards();
  const { createBoard, createdBoard, isCreating, error: createBoardError } = useCreateBoard();
  const { createElement } = useCreateElement();
  const { profile: profiles } = useGetAllProfiles();
  const { linkBoardToProfile } = useCreateProfileBoardLink();

  const deleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const data = e.dataTransfer;

    const offsetX = e.nativeEvent.offsetX;
    const offsetY = e.nativeEvent.offsetY;

    const baseItem = {
      id: Date.now(),
      x: offsetX,
      y: offsetY,
      width: 200,
      height: 100,
      type: "text",
      content: "",
    };

    if (data.files.length > 0) {
      const file = data.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          setItems((prev) => [
            ...prev,
            { ...baseItem, type: "image", content: reader.result, width: img.width, height: img.height },
          ]);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
      return;
    }

    if (data.types.includes("text/plain")) {
      const text = data.getData("text/plain");
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.visibility = "hidden";
      tempDiv.style.maxWidth = "400px";
      tempDiv.style.padding = "1px";
      tempDiv.style.fontSize = "16px";
      tempDiv.innerText = text;
      document.body.appendChild(tempDiv);
      const measuredWidth = tempDiv.offsetWidth;
      const measuredHeight = tempDiv.offsetHeight;
      document.body.removeChild(tempDiv);

      setItems((prev) => [
        ...prev,
        { ...baseItem, type: "text", content: text, width: measuredWidth + 1, height: measuredHeight + 1 },
      ]);
      return;
    }

    if (data.types.includes("text/uri-list")) {
      const url = data.getData("text/uri-list");
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        setItems((prev) => [
          ...prev,
          { ...baseItem, type: "image", content: url, width: img.width, height: img.height },
        ]);
      };
      img.onerror = () => {
        setItems((prev) => [
          ...prev,
          { ...baseItem, type: "url", content: url, width: 300, height: 60 },
        ]);
      };
      img.src = url;
    }
  };

  const loadBoardElements = async (boardId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/boards/${boardId}/elements`);
      const data = await res.json();
      const loadedItems = data.map((el) => ({
        id: el.id,
        x: el.posX,
        y: el.posY,
        width: el.width,
        height: el.height,
        type: el.type,
        content: el.content,
      }));
      setItems(loadedItems);
      setShowBoards(false);
    } catch (err) {
      console.error("Erreur chargement éléments du board", err);
      alert("Erreur lors du chargement des éléments.");
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const startDrag = (e, id) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const handleMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      setItems((prev) =>
        prev.map((el) => (el.id === id ? { ...el, x: item.x + dx, y: item.y + dy } : el))
      );
    };

    const stopDrag = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDrag);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopDrag);
  };

  return (
    <div
      ref={containerRef}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{
        position: "relative",
        width: "300%",
        height: "100vh",
        background: "#f9f9f9",
        overflow: "hidden",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#333",
          color: "#fff",
          padding: "10px 16px",
          position: "sticky",
          top: 0,
          zIndex: 1001,
        }}
      >
        <h2 style={{ margin: 0, fontSize: "16px" }}>🧠 Moodboard Extension</h2>
        <div>
          <button
            onClick={() => setShowBoards(!showBoards)}
            style={{
              background: "#555",
              color: "#fff",
              padding: "6px 10px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: 12,
              marginRight: 8,
            }}
          >
            📋 Mes boards
          </button>
          <button
            onClick={() => setShowProfiles(!showProfiles)}
            style={{
              background: "#888",
              color: "#fff",
              padding: "6px 10px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            👤 Profils
          </button>
        </div>
      </header>

      {/* ITEMS DROPPÉS */}
      {items.map((item) => (
        <div
          key={item.id}
          onMouseDown={(e) => startDrag(e, item.id)}
          style={{
            position: "absolute",
            top: item.y,
            left: item.x,
            width: item.width,
            height: item.height,
            cursor: "move",
            background: "#fff",
            border: "1px solid #ccc",
            boxShadow: "2px 2px 6px rgba(0,0,0,0.1)",
            padding: 8,
            overflow: "hidden",
            borderRadius: 8,
          }}
        >
          <button
            onClick={() => deleteItem(item.id)}
            style={{
              position: "absolute",
              top: 2,
              right: 2,
              background: "#f44336",
              color: "#fff",
              border: "none",
              borderRadius: "50%",
              width: 16,
              height: 16,
              cursor: "pointer",
              fontSize: "10px",
              lineHeight: "16px",
              textAlign: "center",
            }}
            title="Supprimer"
          >
            ×
          </button>

          {item.type === "text" && <p>{item.content}</p>}
          {item.type === "url" && (
            <a href={item.content} target="_blank" rel="noreferrer">
              {item.content}
            </a>
          )}
          {item.type === "image" && (
            <img
              src={item.content}
              alt="drop"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                display: "block",
                objectFit: "contain",
              }}
            />
          )}
        </div>
      ))}

      {/* SAUVEGARDE */}
      <div style={{ position: "fixed", bottom: 10, left: 10 }}>
        <button
          onClick={async () => {
            const title = prompt("Titre du board :");
            const description = prompt("Description du board :");
            if (!title) return;

            let profileId = selectedProfile?.id;
            if (!profileId) {
              let fallback = profiles.find((p) => p.nom === "Non classés");
              if (!fallback) {
                const res = await fetch("http://localhost:3000/api/profiles", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    title: "Non classés",
                    description: "Boards sans catégorie",
                  }),
                });
                fallback = await res.json();
              }
              profileId = fallback.id;
            }

            const newBoard = await createBoard(title, description);
            refetch();

            if (!newBoard || !newBoard.id || !profileId) return;

            await linkBoardToProfile(profileId, newBoard.id);

            for (const item of items) {
              await createElement(
                item.type,
                item.content,
                item.x,
                item.y,
                item.width,
                item.height,
                newBoard.id
              );
            }

            alert("Board, éléments et profil enregistrés !");
            setItems([]);
          }}
          disabled={isCreating}
          style={{
            background: "#4caf50",
            color: "white",
            padding: "10px 16px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            opacity: isCreating ? 0.6 : 1,
          }}
        >
          💾 Sauvegarder le board
        </button>

        {createdBoard && (
          <p style={{ marginTop: 8, color: "#4caf50" }}>
            Board créé : {createdBoard.title}
          </p>
        )}
        {createBoardError && (
          <p style={{ marginTop: 8, color: "red" }}>
            Erreur : {createBoardError.message}
          </p>
        )}
      </div>

      {/* LISTES */}
      <BoardsList
        visible={showBoards}
        boards={boards}
        isLoading={isLoading}
        getAllBoardsError={getAllBoardsError}
        refetch={refetch}
        onLoadBoard={loadBoardElements}
      />
      {showProfiles && (
        <ProfilesList
          onSelectProfile={(profile) => {
            setSelectedProfile(profile);
            setShowProfiles(false);
          }}
        />
      )}
    </div>
  );
}

export default App;
