import { useState } from "react";

function App() {
  const [droppedContent, setDroppedContent] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();

    const data = e.dataTransfer;

    if (data.types.includes("text/plain")) {
      const text = data.getData("text/plain");
      setDroppedContent({ type: "text", content: text });
    }

    if (data.types.includes("text/uri-list")) {
      const url = data.getData("text/uri-list");
      setDroppedContent({ type: "url", content: url });
    }

    if (data.files.length > 0) {
      const file = data.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setDroppedContent({ type: file.type.startsWith("image") ? "image" : "file", content: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
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
        <img src={droppedContent.content} alt="Dropped" style={{ maxWidth: "100%" }} />
      )}
    </div>
  );
}

export default App;
