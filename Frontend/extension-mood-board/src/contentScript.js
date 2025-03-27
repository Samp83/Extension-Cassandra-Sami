document.addEventListener("mouseup", () => {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText) {
    chrome.storage.local.set({
    droppedContent: {
      type: "text",
      content: selectedText
    }
    });
  }
  });
  
  document.addEventListener("contextmenu", (e) => {
  const target = e.target;
  if (target.tagName === "IMG") {
    chrome.storage.local.set({
    droppedContent: {
      type: "image",
      content: target.src
    }
    });
  } else if (target.tagName === "VIDEO") {
    chrome.storage.local.set({
    droppedContent: {
      type: "video",
      content: target.currentSrc
    }
    });
  }
  });
  
  if (typeof chrome.sidePanel !== "undefined" && chrome.sidePanel.setOptions) {
  chrome.sidePanel.setOptions({
    path: "index.html",
    enabled: true
  });
  }
