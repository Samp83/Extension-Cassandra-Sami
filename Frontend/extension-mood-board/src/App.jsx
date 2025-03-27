import { useEffect, useRef, useState } from "react";
import { useCreateBoard } from "./hooks/useCreateBoard";
import { useCreateElement } from "./hooks/useCreateElement";
import { useGetAllBoards } from "./hooks/useGetAllBoards";
import { useCreateProfileBoardLink } from "./hooks/useCreateProfileBoardLink";
import { useGetAllProfiles } from "./hooks/useGetAllProfiles";
import { useUpdateBoard } from "./hooks/useUpdateBoard";
import { useDeleteElement } from "./hooks/useDeleteElement";
import BoardsList from "./BoardsList";
import ProfilesList from "./ProfilesList";
import './App.css'

function App() {
  const [items, setItems] = useState([]);
  const [showBoards, setShowBoards] = useState(false);
  const [showProfiles, setShowProfiles] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [currentBoardId, setCurrentBoardId] = useState(null);
  const { updateBoard, isUpdating } = useUpdateBoard();
  const { deleteElement } = useDeleteElement();
  const containerRef = useRef(null);

  const {
    boards,
    isLoading,
    error: getAllBoardsError,
    refetch,
  } = useGetAllBoards();
  const {
    createBoard,
    createdBoard,
    isCreating,
    error: createBoardError,
  } = useCreateBoard();
  const { createElement } = useCreateElement();
  const { profile: profiles } = useGetAllProfiles();
  const { linkBoardToProfile } = useCreateProfileBoardLink();

  const deleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearBoardElements = async (boardId) => {
    const res = await fetch(
      `http://localhost:3000/api/boards/${boardId}/elements`
    );
    const data = await res.json();
    for (const el of data) {
      await deleteElement(el.id);
    }
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
            {
              ...baseItem,
              type: "image",
              content: reader.result,
              width: img.width,
              height: img.height,
            },
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
        {
          ...baseItem,
          type: "text",
          content: text,
          width: measuredWidth + 1,
          height: measuredHeight + 1,
        },
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
          {
            ...baseItem,
            type: "image",
            content: url,
            width: img.width,
            height: img.height,
          },
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
      const res = await fetch(
        `http://localhost:3000/api/boards/${boardId}/elements`
      );
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
      setCurrentBoardId(boardId);
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
        prev.map((el) =>
          el.id === id ? { ...el, x: item.x + dx, y: item.y + dy } : el
        )
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
    >
      {/* HEADER */}
      <header>
        <h2>🧠 Moodboard Extension</h2>
        <div>
          <button
            onClick={() => setShowBoards(!showBoards)}
          >
            📋 Mes boards
          </button>
          <button
            onClick={() => setShowProfiles(!showProfiles)}
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
        >
          <button
            onClick={() => deleteItem(item.id)}
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
            />
          )}
        </div>
      ))}

      {/* SAUVEGARDE */}
      <div>
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
                    nom: "Non classés",
                    couleur: "Boards sans catégorie",
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
              console.log("Enregistrement item :", item);
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
          disabled={isCreating}>
          💾 Sauvegarder le board
        </button>
        {createdBoard && (
          <p>
            Board créé : {createdBoard.title}
          </p>
        )}
        {createBoardError && (
          <p>
            Erreur : {createBoardError.message}
          </p>
        )}
      </div>
      <div>
        {currentBoardId && (
          <button
            onClick={async () => {
              const confirmEdit = confirm(
                "Cela va écraser les éléments existants du board. Continuer ?"
              );
              if (!confirmEdit) return;

              // 🔁 Supprime tous les anciens éléments
              await clearBoardElements(currentBoardId);

              // 💾 Ajoute les nouveaux
              for (const item of items) {
                await createElement(
                  item.type,
                  item.content,
                  item.x,
                  item.y,
                  item.width,
                  item.height,
                  currentBoardId
                );
              }

              alert("Modifications enregistrées !");
            }}
            disabled={isUpdating}>
            📝 Enregistrer les changements
          </button>
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
