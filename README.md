# YTV Tags

[YTV-Tags](https://ajayparihar.github.io/ytv-tags)

## Overview

YTV Tags is a web application that allows users to extract and view the keywords from a YouTube video page. By entering a YouTube video URL, users can fetch the keywords embedded in the video's page source and display them in a user-friendly interface.

## Functionality

### User Guide

1. **Open the Application**: Navigate to [https://ajayparihar.github.io/ytv-tags](https://ajayparihar.github.io/ytv-tags) in your web browser.
2. **Enter YouTube Video URL**: In the input field, enter the URL of the YouTube video from which you want to extract keywords.
3. **Fetch Keywords**: Click the "Get Tags" button or press the Enter key to fetch the keywords.
4. **View Keywords**: The extracted keywords will be displayed in the textarea below the input field. If the URL is invalid or no keywords are found, an appropriate message will be displayed.

## Technical Details

### Project Structure

- `index.html`: Contains the HTML structure of the web page.
- `styles.css`: Contains the CSS styles for the web page.
- `script.js`: Contains the JavaScript code that handles the functionality of the web page.
- `README.md`: Documentation for the project.

### How It Works

1. **Input Validation**: The application validates the entered URL to ensure it is a valid YouTube video URL.
2. **Fetching Page Source**: The application uses a proxy API to fetch the HTML source code of the specified YouTube video page.
3. **Extracting Keywords**: The application parses the fetched HTML source code to extract the keywords from the meta tags.
4. **Displaying Keywords**: The extracted keywords are displayed in a textarea on the web page.

### Dependencies

This project uses a proxy API to fetch the page source. Ensure you have an internet connection to use this feature.

### Proxy API

The application uses the following proxy API to fetch the page source:

```
https://api.codetabs.com/v1/proxy?quest={URL}
```

Replace `{URL}` with the encoded YouTube video URL.

### JavaScript Functions

- **onDOMContentLoaded**: Initializes the application and sets up event listeners.
- **fetchKeywords**: Fetches the keywords from the YouTube video URL.
- **getProxyUrl**: Constructs the proxy URL for fetching the page source.
- **extractKeywords**: Extracts keywords from the fetched HTML source code.
- **handleError**: Handles errors during the fetch process.
- **toggleVisibility**: Toggles the visibility of an element.
- **getInputValue**: Gets the value of an input element.
- **setInputValue**: Sets the value of an input element.
- **addEnterKeyListener**: Adds an event listener for the Enter key.
- **isValidYouTubeUrl**: Validates if the URL is a YouTube video URL.

### CSS Styling

The application uses CSS for styling the web page. Key styles include:

- **Root Variables**: Defines CSS variables for colors, gradients, and other styles.
- **Body Styling**: Styles the body of the web page.
- **Header**: Styles the header and the `h1` element.
- **App Container**: Styles the main container of the application.
- **Input Wrapper**: Styles the input field wrapper.
- **Buttons**: Styles the buttons.
- **Output Wrapper**: Styles the output textarea.
- **Animations**: Defines keyframe animations for fade-in effects.
- **Responsive Design**: Ensures the application is responsive on different screen sizes.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
