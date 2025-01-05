// Author: Ajay Singh
// Date: 05-01-2025
// Version: 0.1

// Constants
const LOADING_PAGE_ID = "loadingPage";
const CONTENT_ID = "appContainer";
const URL_INPUT_ID = "urlInput";
const LOADING_KEYWORDS_ID = "loadingKeywords";
const KEYWORDS_OUTPUT_ID = "keywordsOutput";

// Event Listeners
document.addEventListener("DOMContentLoaded", onDOMContentLoaded);

// Functions
function onDOMContentLoaded() {
    toggleVisibility(LOADING_PAGE_ID, false);
    toggleVisibility(CONTENT_ID, true);
}

async function fetchKeywords() {
    const url = getInputValue(URL_INPUT_ID);
    const loadingKeywords = document.getElementById(LOADING_KEYWORDS_ID);
    const keywordsOutput = document.getElementById(KEYWORDS_OUTPUT_ID);
    
    if (url) {
        showLoading(loadingKeywords, keywordsOutput);
        try {
            const response = await fetch(getProxyUrl(url));
            const text = await response.text();
            const keywords = extractKeywords(text);
            keywordsOutput.value = keywords || 'No keywords found in the video page source.';
        } catch (error) {
            handleError(error, keywordsOutput);
        } finally {
            hideLoading(loadingKeywords);
        }
    } else {
        alert('Please enter a YouTube video URL');
        keywordsOutput.value = 'Please enter a YouTube video URL to extract keywords.';
    }
}

async function pasteFromClipboard() {
    try {
        const text = await navigator.clipboard.readText();
        setInputValue(URL_INPUT_ID, text);
        fetchKeywords(); // Automatically fetch keywords after pasting the URL
    } catch (err) {
        console.error('Failed to read clipboard contents: ', err);
        alert('Failed to read clipboard contents. Please try again.');
    }
}

function copyToClipboard() {
    const keywordsOutput = document.getElementById(KEYWORDS_OUTPUT_ID);
    navigator.clipboard.writeText(keywordsOutput.value).then(() => {
        console.log('Keywords copied to clipboard');
        alert('Keywords copied to clipboard');
    }).catch(err => {
        console.error('Failed to copy keywords: ', err);
        alert('Failed to copy keywords. Please try again.');
    });
}

// Helper Functions
function showLoading(loadingElement, outputElement) {
    loadingElement.classList.remove("hidden");
    outputElement.value = '';
}

function hideLoading(loadingElement) {
    loadingElement.classList.add("hidden");
}

function getProxyUrl(url) {
    return `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`;
}

function extractKeywords(text) {
    const keywordMatch = text.match(/<meta\s+name=["']keywords["']\s+content=["']([^"']+)["']/i);
    return keywordMatch && keywordMatch[1];
}

function handleError(error, outputElement) {
    console.error('Error fetching page source:', error);
    outputElement.value = 'Error fetching page source: ' + error.message;
}

function toggleVisibility(elementId, isVisible) {
    const element = document.getElementById(elementId);
    if (isVisible) {
        element.classList.remove("hidden");
    } else {
        element.classList.add("hidden");
    }
}

function getInputValue(elementId) {
    return document.getElementById(elementId).value;
}

function setInputValue(elementId, value) {
    document.getElementById(elementId).value = value;
}