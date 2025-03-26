import { useEffect, useRef, useState } from "react";
import { useCreateBoard } from "./hooks/useCreateBoard";
import { useCreateElement } from "./hooks/useCreateElement";
import { useGetAllBoards } from "./hooks/useGetAllBoards";
import BoardsList from "./BoardsList";
import "./App.css"; // <- Don't forget this!

function App() {
  const [items, setItems] = useState([]);
  const [showBoards, setShowBoards] = useState(false);
  const containerRef = useRef(null);

  const { boards, isLoading, error: getAllBoardsError, refetch } = useGetAllBoards();
  const { createBoard, createdBoard, isCreating, error: createBoardError } = useCreateBoard();
  const { createElement } = useCreateElement();

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
      tempDiv.style.width = "auto";
      tempDiv.style.height = "auto";
      tempDiv.style.maxWidth = "400px";
      tempDiv.style.padding = "1px";
      tempDiv.style.fontSize = "16px";
      tempDiv.style.fontFamily = "Arial, sans-serif";
      tempDiv.style.lineHeight = "1.4";
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
          {
            ...baseItem,
            type: "url",
            content: url,
            width: 300,
            height: 60,
          },
        ]);
      };
      img.src = url;
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

  const saveBoardWithElements = async () => {
    const title = prompt("Titre du board :");
    const description = prompt("Description du board :");
    if (!title) return;

    const newBoard = await createBoard(title, description);
    refetch();

    if (!newBoard || !newBoard.id) return;

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

    alert("Board et éléments enregistrés !");
    setItems([]);
  };

  return (
    <div
      ref={containerRef}
      className="moodboard-container"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <header className="moodboard-header">
        <h2>🧠 Moodboard Extension</h2>
        <button onClick={() => setShowBoards(!showBoards)}>📋 Mes boards</button>
      </header>

      {items.map((item) => (
        <div
          key={item.id}
          onMouseDown={(e) => startDrag(e, item.id)}
          className="moodboard-item"
          style={{
            top: item.y,
            left: item.x,
            width: item.width,
            height: item.height,
          }}
        >
          <button onClick={() => deleteItem(item.id)} title="Supprimer">
            ×
          </button>

          {item.type === "text" && <p>{item.content}</p>}
          {item.type === "url" && (
            <a href={item.content} target="_blank" rel="noreferrer">
              {item.content}
            </a>
          )}
          {item.type === "image" && (
            <img src={item.content} alt="drop" />
          )}
        </div>
      ))}

      <div className="fixed-actions">
        <button
          className="save-board-btn"
          onClick={saveBoardWithElements}
          disabled={isCreating}
        >
          💾 Sauvegarder le board
        </button>

        {createdBoard && (
          <p className="board-success">
            Board créé : {createdBoard.title}
          </p>
        )}
        {createBoardError && (
          <p className="board-error">
            Erreur : {createBoardError.message}
          </p>
        )}
      </div>

      <BoardsList
        visible={showBoards}
        boards={boards}
        isLoading={isLoading}
        getAllBoardsError={getAllBoardsError}
        refetch={refetch}
        onLoadBoard={loadBoardElements}
      />
    </div>
  );
}

export default App;
