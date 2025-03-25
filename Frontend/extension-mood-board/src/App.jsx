import { useState } from "react";

function App() {
  const [droppedContent, setDroppedContent] = useState(null);

  const handleDrop = async (e) => {
    e.preventDefault();
    const data = e.dataTransfer;
  
    // 1. Fichier (image locale ou drag depuis Chrome)
    if (data.files.length > 0) {
      const file = data.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setDroppedContent({
          type: file.type.startsWith("image") ? "image" : "file",
          content: reader.result
        });
      };
      reader.readAsDataURL(file);
      return;
    }
  
    // 2. Texte (sélection, titre, etc.)
    if (data.types.includes("text/plain")) {
      const text = data.getData("text/plain");
      if (text && !text.startsWith("http")) {
        setDroppedContent({ type: "text", content: text });
        return;
      }
    }
  
    // 3. URL (drag d'image dans Firefox ou lien)
    if (data.types.includes("text/uri-list")) {
      const url = data.getData("text/uri-list");
  
      // Si c'est une image, on essaie de fetch (Firefox fallback)
      if (url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i)) {
        try {
          const response = await fetch(url);
          const blob = await response.blob();
          const reader = new FileReader();
          reader.onload = () => {
            setDroppedContent({ type: "image", content: reader.result });
          };
          reader.readAsDataURL(blob);
          return;
        } catch (err) {
          console.error("Erreur fetch image:", err);
        }
      }
  
      // Sinon, juste un lien
      setDroppedContent({ type: "url", content: url });
      return;
    }
  };
  

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      style={{
        border: "2px dashed #aaa",
        padding: "2rem",
        borderRadius: "12px",
        textAlign: "center",
        minHeight: "200px"
      }}
    >
      {!droppedContent && <p>Glisse du texte, une image ou un lien ici !</p>}

      {droppedContent?.type === "text" && <p>{droppedContent.content}</p>}

      {droppedContent?.type === "url" && (
        <a href={droppedContent.content} target="_blank" rel="noreferrer">
          {droppedContent.content}
        </a>
      )}

      {droppedContent?.type === "image" && (
        <img
          src={droppedContent.content}
          alt="Dropped"
          style={{ maxWidth: "100%", borderRadius: "8px" }}
        />
      )}
    </div>
  );
}

export default App;
