// Claude Artifacts Extractor - Chrome Extension
// background.js - Handles downloads and background tasks

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'download') {
    // Create a blob from the data
    const blob = new Blob([message.data], { type: message.type });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Download the file
    chrome.downloads.download({
      url: url,
      filename: message.filename,
      saveAs: true
    }, (downloadId) => {
      // Clean up the URL after download starts
      URL.revokeObjectURL(url);
    });
  }
});

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Open a welcome page or show instructions
    chrome.tabs.create({
      url: 'https://claude.ai'
    });
  }
});
