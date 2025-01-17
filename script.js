// Author: Ajay Singh
// Date: 05-01-2025
// Version: 0.2

// Constants
const CONTENT_ID = "appContainer";
const URL_INPUT_ID = "urlInput";
const KEYWORDS_OUTPUT_ID = "keywordsOutput";
const SPINNER_ID = "loadingSpinner";

// Event Listeners
document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
document
  .getElementById("pasteButton")
  .addEventListener("click", pasteClipboardText);
document
  .getElementById("copyButton")
  .addEventListener("click", copyToClipboard);

// Functions

/**
 * Initializes the app, sets up event listeners.
 */
function onDOMContentLoaded() {
  toggleVisibility(CONTENT_ID, true);
  addEnterKeyListener(URL_INPUT_ID, fetchKeywords);

  const urlInput = document.getElementById(URL_INPUT_ID);
  const keywordsOutput = document.getElementById(KEYWORDS_OUTPUT_ID);

  // Clear input and output fields on page load to ensure fresh state
  urlInput.value = "";
  keywordsOutput.value = "";
}

/**
 * Fetches keywords for the YouTube video URL entered by the user.
 */
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

/**
 * Returns the proxy URL for fetching the YouTube video page source.
 * @param {string} url - The YouTube video URL.
 * @returns {string} Proxy URL.
 */
function getProxyUrl(url) {
  return `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`;
}

/**
 * Extracts the keywords from the YouTube video page source.
 * @param {string} text - The page source text.
 * @returns {string|null} Extracted keywords or null.
 */
function extractKeywords(text) {
  const keywordMatch = text.match(
    /<meta\s+name=["']keywords["']\s+content=["']([^"']+)["']/i
  );
  return keywordMatch && keywordMatch[1];
}

/**
 * Shows a spinner inside the specified output element while fetching data.
 * @param {HTMLElement} outputElement - The output element to display the spinner in.
 */
function showSpinner(outputElement) {
  outputElement.value = ""; // Clear output text
  const spinner = createSpinner();
  const wrapper = outputElement.parentElement;
  wrapper.style.position = "relative"; // Ensure the parent is relatively positioned
  wrapper.appendChild(spinner);
}

/**
 * Creates a spinner element.
 * @returns {HTMLElement} The spinner element.
 */
function createSpinner() {
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
  return spinner;
}

/**
 * Hides the spinner from the output area.
 */
function hideSpinner() {
  const spinner = document.getElementById(SPINNER_ID);
  if (spinner) {
    spinner.remove();
  }
}

/**
 * Toggles visibility of an element based on the isVisible flag.
 * @param {string} elementId - The ID of the element to toggle.
 * @param {boolean} isVisible - Whether the element should be visible.
 */
function toggleVisibility(elementId, isVisible) {
  const element = document.getElementById(elementId);
  element.classList.toggle("hidden", !isVisible);
}

/**
 * Returns the value of an input element.
 * @param {string} elementId - The ID of the input element.
 * @returns {string} The input element value.
 */
function getInputValue(elementId) {
  return document.getElementById(elementId).value;
}

/**
 * Adds an event listener for the Enter key to an input element.
 * @param {string} elementId - The ID of the input element.
 * @param {function} callback - The callback to run when Enter is pressed.
 */
function addEnterKeyListener(elementId, callback) {
  document.getElementById(elementId).addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      callback();
    }
  });
}

/**
 * Validates whether the given URL is a valid YouTube video URL.
 * @param {string} url - The URL to validate.
 * @returns {boolean} True if the URL is a valid YouTube video URL, false otherwise.
 */
function isValidYouTubeUrl(url) {
  const regex =
    /^https?:\/\/(www\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/|live\/)|youtu\.be\/)[\w-]+(\?.*)?$/;
  return regex.test(url);
}

/**
 * Pastes the clipboard content into the URL input field.
 */
async function pasteClipboardText() {
  try {
    const clipboardText = await navigator.clipboard.readText();
    document.getElementById(URL_INPUT_ID).value = clipboardText;
  } catch (err) {
    console.error("Failed to read clipboard contents: ", err);
  }
}

/**
 * Copies the output text to the clipboard and shows a toast notification.
 */
async function copyToClipboard() {
  try {
    const textToCopy = document.getElementById(KEYWORDS_OUTPUT_ID).value;

    // Check if the text to copy is empty or contains only a hint message
    if (
      !textToCopy ||
      textToCopy.trim() === "Keywords will be displayed here..."
    ) {
      // Show toast notification with a custom message
      const toast = document.getElementById("toast");
      toast.textContent = "No tags to copy!";
      toast.classList.add("show");

      // Remove toast after 1 second
      setTimeout(() => {
        toast.classList.remove("show");
      }, 1000);

      return; // Exit the function as there's nothing to copy
    }

    // If there is valid text, copy to clipboard
    await navigator.clipboard.writeText(textToCopy);
    console.log("Text copied to clipboard:", textToCopy);

    // Show toast notification indicating success
    const toast = document.getElementById("toast");
    toast.textContent = "Text copied to clipboard!";
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 1000);
  } catch (err) {
    console.error("Failed to copy text to clipboard: ", err);
  }
}
