# Claude Artifacts Scraper - User Guide

## Overview

This tool allows you to extract and download artifacts from your Claude conversations. It works by running JavaScript in your browser while you're logged into Claude, extracting the artifacts, and downloading them in your preferred format.

## Security & Privacy

- **Your credentials are safe**: The tool runs entirely in your browser and only works when you're already logged into Claude
- **No data transmission**: All processing happens locally in your browser - no data is sent to external servers
- **No storage**: The tool doesn't store your conversations or artifacts anywhere except when you explicitly download them

## Usage Options

### Option 1: Bookmarklet (Simplest)

1. Create a new bookmark in your browser
2. Name it something like "Extract Claude Artifacts"
3. Instead of a URL, paste the entire contents of the `bookmarklet.js` file
4. When viewing a Claude conversation, click the bookmark to extract artifacts
5. Choose your preferred format (JSON or Markdown)
6. Save the downloaded file

### Option 2: Chrome Extension (More Features)

1. Create a folder on your computer for the extension
2. Save all the files from the `src` directory into this folder
3. Open Chrome and go to `chrome://extensions/`
4. Enable "Developer mode" (toggle in the top right)
5. Click "Load unpacked" and select the folder with the extension files
6. Visit Claude.ai and log in
7. You'll see an "Extract Artifacts" button in the Claude interface
8. Click it to extract artifacts and choose your preferred format

## What Gets Extracted?

The tool extracts:
- Code blocks (with language detection)
- Artifact containers
- Images (as URLs)
- Other structured content

## Output Formats

### JSON Format
- Complete structured data
- Includes metadata like timestamps
- Ideal for programmatic use or further processing

### Markdown Format
- Human-readable format
- Code blocks with syntax highlighting
- Image references
- Easy to view in any Markdown editor

## Troubleshooting

- **Button not appearing**: Refresh the page and try again
- **No artifacts found**: Make sure you're on a conversation page with Claude responses
- **Download not working**: Check your browser's download settings and permissions

## Limitations

- Works only with the current Claude web interface (as of May 2025)
- Requires manual login to Claude
- Extracts only from the current conversation
- May not capture all artifact types in future Claude updates

## Future Enhancements

Potential future improvements:
- Batch processing of multiple conversations
- Additional export formats (PDF, HTML)
- Filtering by artifact type
- Integration with cloud storage services
