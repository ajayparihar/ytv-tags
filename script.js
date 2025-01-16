// Author: Ajay Singh
// Date: 05-01-2025
// Version: 0.1

// Constants
const CONTENT_ID = "appContainer";
const URL_INPUT_ID = "urlInput";
const KEYWORDS_OUTPUT_ID = "keywordsOutput";
const SPINNER_ID = "loadingSpinner";

// Event Listeners
document.addEventListener("DOMContentLoaded", onDOMContentLoaded);

// Functions
function onDOMContentLoaded() {
  toggleVisibility(CONTENT_ID, true);
  addEnterKeyListener(URL_INPUT_ID, fetchKeywords);

  // Restore input and output from localStorage
  const urlInput = document.getElementById(URL_INPUT_ID);
  const keywordsOutput = document.getElementById(KEYWORDS_OUTPUT_ID);

  urlInput.value = localStorage.getItem("yt_url") || "";
  keywordsOutput.value = localStorage.getItem("yt_keywords") || "";

  // Save input to localStorage on change
  urlInput.addEventListener("input", () => {
    localStorage.setItem("yt_url", urlInput.value);
  });
}

// Fetch keywords from the YouTube video URL
async function fetchKeywords() {
  const url = getInputValue(URL_INPUT_ID);
  const keywordsOutput = document.getElementById(KEYWORDS_OUTPUT_ID);

  if (url) {
    if (!isValidYouTubeUrl(url)) {
      keywordsOutput.value = "Please enter a valid YouTube video URL.";
      return;
    }

    try {
      showSpinner(keywordsOutput);
      keywordsOutput.value = ""; // Clear previous output
      const response = await fetch(getProxyUrl(url));
      if (!response.ok) {
        throw new Error("Failed to fetch the page source. Please try again.");
      }
      const text = await response.text();
      const keywords = extractKeywords(text);

      keywordsOutput.value =
        keywords || "No keywords found in the video page source.";
      saveKeywordsToStorage(keywordsOutput.value);
    } catch (error) {
      keywordsOutput.value = `Error: ${error.message}`;
    } finally {
      hideSpinner();
    }
  } else {
    keywordsOutput.value =
      "Please enter a YouTube video URL to extract keywords.";
  }
}

// Helper Functions

// Get the proxy URL for fetching the page source
function getProxyUrl(url) {
  return `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`;
}

// Extract keywords from the page source
function extractKeywords(text) {
  const keywordMatch = text.match(
    /<meta\s+name=["']keywords["']\s+content=["']([^"']+)["']/i
  );
  return keywordMatch && keywordMatch[1];
}

// Save extracted keywords to localStorage
function saveKeywordsToStorage(keywords) {
  localStorage.setItem("yt_keywords", keywords);
}

// Show a spinner inside the output area
function showSpinner(outputElement) {
  outputElement.value = ""; // Clear output text
  const spinner = document.createElement("div");
  spinner.className = "spinner";
  spinner.id = SPINNER_ID;
  spinner.style.position = "absolute";
  spinner.style.top = "50%";
  spinner.style.left = "50%";
  spinner.style.transform = "translate(-50%, -50%)";
  spinner.style.zIndex = "10";
  spinner.style.backgroundColor = "transparent";
  spinner.style.width = "40px";
  spinner.style.height = "40px";

  const wrapper = outputElement.parentElement;
  wrapper.style.position = "relative"; // Ensure the parent is relatively positioned
  wrapper.appendChild(spinner);
}

// Hide the spinner from the output area
function hideSpinner() {
  const spinner = document.getElementById(SPINNER_ID);
  if (spinner) {
    spinner.remove();
  }
}

// Toggle visibility of an element
function toggleVisibility(elementId, isVisible) {
  const element = document.getElementById(elementId);
  if (isVisible) {
    element.classList.remove("hidden");
  } else {
    element.classList.add("hidden");
  }
}

// Get the value of an input element
function getInputValue(elementId) {
  return document.getElementById(elementId).value;
}

// Add an event listener for the Enter key
function addEnterKeyListener(elementId, callback) {
  document
    .getElementById(elementId)
    .addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        callback();
      }
    });
}

// Validate if the URL is a YouTube video URL
function isValidYouTubeUrl(url) {
  const regex =
    /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+$/;
  return regex.test(url);
}
