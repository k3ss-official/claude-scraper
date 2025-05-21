# Claude Artifacts Scraper - MVP Architecture

## Overview

Based on our research and analysis, we've determined that the most feasible approach for extracting Claude artifacts is through browser-based scripts that run in an authenticated user session. The official Claude API does not provide endpoints for accessing user artifacts or chat history.

This document outlines the architecture for a Minimum Viable Product (MVP) that will allow users to extract their Claude artifacts in a secure, privacy-preserving manner.

## Design Principles

1. **User Control**: The solution must run entirely client-side and require explicit user initiation
2. **Privacy Preservation**: No data should be sent to external servers
3. **Simplicity**: The MVP should be easy to use with minimal setup
4. **Compatibility**: The solution should work with the current Claude web interface
5. **Security**: The solution should not compromise user credentials or data

## Architecture Components

### 1. User Interface

The MVP will provide two user interface options:

1. **Bookmarklet**: A JavaScript bookmarklet that can be saved to the browser's bookmarks bar
   - Advantages: No installation required, works across browsers
   - Disadvantages: Limited functionality, may break with Claude UI changes

2. **Browser Extension** (Chrome/Firefox): A lightweight extension that adds a download button
   - Advantages: More robust, can handle UI changes better
   - Disadvantages: Requires installation, browser-specific

### 2. Authentication Handling

- The solution will **not** handle authentication directly
- Users must be already logged into Claude.ai in their browser
- The script will run in the context of the authenticated session

### 3. Artifact Extraction Logic

The extraction logic will:

1. Identify and parse the DOM structure of the Claude web interface
2. Extract all artifacts from the current conversation
3. Organize artifacts by type (code, text, images, etc.)
4. Package artifacts into appropriate formats (individual files or ZIP)

### 4. Export Formats

The MVP will support the following export formats:

1. **JSON**: Raw data format for programmatic use
2. **Markdown**: Human-readable format for documentation
3. **ZIP Archive**: For downloading multiple artifacts at once

## Technical Approach

### Bookmarklet Implementation

```javascript
javascript:(function(){
  // Inject the extraction script
  var script = document.createElement('script');
  script.src = 'https://example.com/claude-extractor.js';
  document.body.appendChild(script);
})();
```

### Browser Extension Implementation

The extension will consist of:

1. **Manifest File**: Defines permissions and extension properties
2. **Content Script**: Injects the UI elements and handles user interaction
3. **Background Script**: Manages the extraction process
4. **Utility Libraries**: For ZIP creation and file handling

### Artifact Extraction Process

1. **DOM Traversal**: Identify conversation elements and artifact containers
2. **Data Extraction**: Parse and extract artifact content
3. **Metadata Collection**: Gather context and timestamps
4. **Format Conversion**: Convert to desired output format
5. **Download Initiation**: Trigger browser download

## Security Considerations

1. **No External Dependencies**: All code runs locally in the browser
2. **No Data Transmission**: Artifacts are processed locally and downloaded directly
3. **Minimal Permissions**: Only request permissions needed for the extraction process
4. **User Initiation**: All actions require explicit user approval
5. **Cloudflare Handling**: Work within Cloudflare constraints by running in user's authenticated session

## Limitations

1. **UI Dependency**: May break if Claude significantly changes their web interface
2. **Authentication Requirement**: User must be logged in to Claude.ai
3. **Browser Compatibility**: May have different behavior across browsers
4. **Rate Limiting**: Excessive use might trigger Cloudflare or Claude rate limits
5. **No Batch Processing**: Initial MVP will only process one conversation at a time

## Implementation Plan

1. Develop the core extraction logic as a standalone JavaScript module
2. Create a simple bookmarklet implementation for initial testing
3. Develop a basic Chrome extension with minimal UI
4. Test with various Claude conversations and artifact types
5. Refine based on testing feedback
6. Package for distribution

## Future Enhancements

1. Support for batch processing multiple conversations
2. Additional export formats (PDF, HTML)
3. Filtering options for specific artifact types
4. Integration with local storage or cloud services
5. Firefox and other browser support
