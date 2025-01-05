// Author: Ajay Singh
// Date: 05-01-2025
// Version: 0.1

// Constants
const CONTENT_ID = "appContainer";
const URL_INPUT_ID = "urlInput";
const KEYWORDS_OUTPUT_ID = "keywordsOutput";

// Event Listeners
document.addEventListener("DOMContentLoaded", onDOMContentLoaded);

// Functions
function onDOMContentLoaded() {
    toggleVisibility(CONTENT_ID, true);
    addEnterKeyListener(URL_INPUT_ID, fetchKeywords);
}

// Fetch keywords from the YouTube video URL
async function fetchKeywords() {
    const url = getInputValue(URL_INPUT_ID);
    const keywordsOutput = document.getElementById(KEYWORDS_OUTPUT_ID);
    
    if (url) {
        if (!isValidYouTubeUrl(url)) {
            keywordsOutput.value = 'Please enter a valid YouTube video URL.';
            return;
        }
        try {
            keywordsOutput.value = 'Fetching keywords...';
            const response = await fetch(getProxyUrl(url));
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const text = await response.text();
            const keywords = extractKeywords(text);
            keywordsOutput.value = keywords || 'No keywords found in the video page source.';
        } catch (error) {
            handleError(error, keywordsOutput);
        }
    } else {
        keywordsOutput.value = 'Please enter a YouTube video URL to extract keywords.';
    }
}

// Helper Functions

// Get the proxy URL for fetching the page source
function getProxyUrl(url) {
    return `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`;
}

// Extract keywords from the page source
function extractKeywords(text) {
    const keywordMatch = text.match(/<meta\s+name=["']keywords["']\s+content=["']([^"']+)["']/i);
    return keywordMatch && keywordMatch[1];
}

// Handle errors during the fetch process
function handleError(error, outputElement) {
    console.error('Error fetching page source:', error);
    outputElement.value = 'Error fetching page source: ' + error.message;
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

// Set the value of an input element
function setInputValue(elementId, value) {
    document.getElementById(elementId).value = value;
}

// Add an event listener for the Enter key
function addEnterKeyListener(elementId, callback) {
    document.getElementById(elementId).addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            callback();
        }
    });
}

// Validate if the URL is a YouTube video URL
function isValidYouTubeUrl(url) {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return regex.test(url);
}