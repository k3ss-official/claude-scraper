# Claude Artifacts Scraper

A browser-based tool to extract and download artifacts from Claude AI conversations.

## Overview

Claude Artifacts Scraper allows you to easily extract and download artifacts (code snippets, diagrams, etc.) from your Claude conversations. It works by running JavaScript in your browser while you're logged into Claude, extracting the artifacts, and downloading them in your preferred format.

## Features

- Extract code blocks with language detection
- Download artifacts in JSON or Markdown format
- Works with the current Claude web interface
- Runs entirely in your browser - no data sent to external servers
- Available as a simple bookmarklet or Chrome extension

## Security & Privacy

- **Your credentials are safe**: The tool runs entirely in your browser and only works when you're already logged into Claude
- **No data transmission**: All processing happens locally in your browser - no data is sent to external servers
- **No storage**: The tool doesn't store your conversations or artifacts anywhere except when you explicitly download them

## Installation & Usage

### Option 1: Bookmarklet (Simplest)

1. Create a new bookmark in your browser
2. Name it something like "Extract Claude Artifacts"
3. Instead of a URL, paste the entire contents of the `src/bookmarklet.js` file
4. When viewing a Claude conversation, click the bookmark to extract artifacts
5. Choose your preferred format (JSON or Markdown)
6. Save the downloaded file

### Option 2: Chrome Extension (More Features)

1. Clone this repository or download the source code
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top right)
4. Click "Load unpacked" and select the `src` directory from this repository
5. Visit Claude.ai and log in
6. You'll see an "Extract Artifacts" button in the Claude interface
7. Click it to extract artifacts and choose your preferred format

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

## Documentation

For more detailed information, see:
- [User Guide](docs/user_guide.md)
- [Architecture](docs/mvp_architecture.md)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Inspired by similar tools for extracting ChatGPT conversations
- Thanks to the Claude AI team for creating a great product
