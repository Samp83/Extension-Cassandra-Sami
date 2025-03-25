document.addEventListener("mouseup", () => {
    const selection = window.getSelection();
    const selectedText = selection.toString();
  
    if (selectedText) {
      chrome.storage.local.set({ droppedContent: { type: "text", content: selectedText } });
    }
  });

  document.addEventListener("contextmenu", (e) => {
    const target = e.target;
  
    if (target.tagName === "IMG") {
      chrome.storage.local.set({ droppedContent: { type: "image", content: target.src } });
    }
  
    if (target.tagName === "VIDEO") {
      chrome.storage.local.set({ droppedContent: { type: "video", content: target.currentSrc } });
    }
  });
  
  chrome.storage.local.get("droppedContent", (result) => {
    setContent(result.droppedContent);
    chrome.storage.local.remove("droppedContent");
  });

  chrome.sidePanel.setOptions({
    path: "index.html",
    enabled: true
  });
  