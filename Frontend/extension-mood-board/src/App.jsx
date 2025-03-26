import { useEffect, useRef, useState } from "react";

function App() {
  const [items, setItems] = useState([]);
  const containerRef = useRef(null);

  // Supprimer un item par ID
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
      content: ""
    };

    // Drag d’un fichier (image locale)
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
              height: img.height
            }
          ]);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
      return;
    }

    if (data.types.includes("text/plain")) {
      const text = data.getData("text/plain");
    
      // Crée un div temporaire pour mesurer le texte
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.visibility = "hidden";
      tempDiv.style.width = "auto";
      tempDiv.style.height = "auto";
      tempDiv.style.maxWidth = "400px"; // tu peux ajuster
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
          width: measuredWidth + 1, // + padding
          height: measuredHeight + 1
        }
      ]);
      return;
    }

    // URL (souvent image glissée depuis Chrome)
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
            height: img.height
          }
        ]);
      };
      img.onerror = () => {
        // pas une image ? afficher juste le lien
        setItems((prev) => [
          ...prev,
          {
            ...baseItem,
            type: "url",
            content: url,
            width: 300,
            height: 60
          }
        ]);
      };
      img.src = url;
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

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
      style={{
        position: "relative",
        width: "10000%",
        height: "100vh",
        border: "2px dashed #aaa",
        overflow: "hidden",
        background: "#f9f9f9"
      }}
    >
      <p style={{ padding: 10, fontWeight: "bold" }}>Glisse ici ton contenu 🎯</p>

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
            borderRadius: 8
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
              width: 10,
              height: 10,
              cursor: "pointer",
              fontSize: "6px",
              lineHeight: "10px",
              
            }}
            title="Supprimer"
          >
            
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
                objectFit: "contain"
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default App;
