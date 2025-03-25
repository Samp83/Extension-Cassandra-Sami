// contentScript.js

// This script will run in the context of a webpage and can interact with the DOM.

// Example: Highlight all paragraphs on the page
(function () {
    console.log("Content script loaded!");

    // Function to highlight all paragraphs
    function highlightParagraphs() {
        const paragraphs = document.querySelectorAll("p");
        paragraphs.forEach((p) => {
            p.style.backgroundColor = "yellow";
        });
        console.log(`${paragraphs.length} paragraphs highlighted.`);
    }

    // Run the function when the DOM is fully loaded
    document.addEventListener("DOMContentLoaded", highlightParagraphs);
})();