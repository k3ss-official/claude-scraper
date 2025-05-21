// Claude Artifacts Extractor - Chrome Extension
// content.js - Injects UI and handles extraction

// Wait for page to fully load
window.addEventListener('load', function() {
  // Check if we're on Claude.ai
  if (!window.location.href.includes('claude.ai')) {
    return;
  }
  
  console.log('Claude Artifacts Extractor extension loaded');
  
  // Wait for the UI to be fully rendered
  setTimeout(injectExtractionButton, 2000);
});

// Create and inject the extraction button into Claude's UI
function injectExtractionButton() {
  // Check if button already exists
  if (document.getElementById('claude-artifact-extractor-btn')) {
    return;
  }
  
  // Find a good location to inject the button
  const header = document.querySelector('header');
  if (!header) {
    console.error("Could not find header to inject button");
    // Try again later
    setTimeout(injectExtractionButton, 1000);
    return;
  }
  
  // Create button
  const button = document.createElement('button');
  button.id = 'claude-artifact-extractor-btn';
  button.textContent = 'Extract Artifacts';
  button.style.cssText = `
    background-color: #6e56cf;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    margin: 8px;
    cursor: pointer;
    font-weight: bold;
  `;
  
  // Add click handler
  button.addEventListener('click', handleExtraction);
  
  // Inject button
  header.appendChild(button);
  console.log("Extraction button injected");
}

// Handle the extraction process
function handleExtraction() {
  console.log("Starting extraction process");
  
  const result = extractClaudeArtifacts();
  
  if (result.error) {
    alert(`Error extracting artifacts: ${result.error}`);
    return;
  }
  
  if (result.artifacts.length === 0) {
    alert('No artifacts found in this conversation.');
    return;
  }
  
  // Create format selection dialog
  const dialog = document.createElement('div');
  dialog.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    display: flex;
    flex-direction: column;
    gap: 16px;
  `;
  
  const title = document.createElement('h3');
  title.textContent = `Found ${result.artifacts.length} artifacts. Choose export format:`;
  title.style.margin = '0';
  
  const buttonContainer = document.createElement('div');
  buttonContainer.style.cssText = `
    display: flex;
    gap: 12px;
    justify-content: center;
  `;
  
  const jsonButton = document.createElement('button');
  jsonButton.textContent = 'JSON';
  jsonButton.style.cssText = `
    padding: 8px 16px;
    background: #6e56cf;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  `;
  
  const markdownButton = document.createElement('button');
  markdownButton.textContent = 'Markdown';
  markdownButton.style.cssText = `
    padding: 8px 16px;
    background: #6e56cf;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  `;
  
  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel';
  cancelButton.style.cssText = `
    padding: 8px 16px;
    background: #f1f1f1;
    color: #333;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  `;
  
  jsonButton.addEventListener('click', () => {
    const json = formatAsJson(result.artifacts);
    chrome.runtime.sendMessage({
      action: 'download',
      data: json,
      filename: 'claude-artifacts.json',
      type: 'application/json'
    });
    document.body.removeChild(dialog);
  });
  
  markdownButton.addEventListener('click', () => {
    const markdown = formatAsMarkdown(result.artifacts);
    chrome.runtime.sendMessage({
      action: 'download',
      data: markdown,
      filename: 'claude-artifacts.md',
      type: 'text/markdown'
    });
    document.body.removeChild(dialog);
  });
  
  cancelButton.addEventListener('click', () => {
    document.body.removeChild(dialog);
  });
  
  buttonContainer.appendChild(jsonButton);
  buttonContainer.appendChild(markdownButton);
  buttonContainer.appendChild(cancelButton);
  
  dialog.appendChild(title);
  dialog.appendChild(buttonContainer);
  
  document.body.appendChild(dialog);
}

// Main extraction function
function extractClaudeArtifacts() {
  console.log("Starting Claude artifacts extraction...");
  
  // Get conversation container
  const conversationContainer = document.querySelector('[data-testid="conversation-turn-list"]');
  if (!conversationContainer) {
    console.error("Could not find conversation container");
    return { error: "Conversation container not found", artifacts: [] };
  }
  
  // Get all conversation turns
  const conversationTurns = conversationContainer.querySelectorAll('[data-testid="conversation-turn"]');
  console.log(`Found ${conversationTurns.length} conversation turns`);
  
  // Extract artifacts from each turn
  const artifacts = [];
  let artifactIndex = 0;
  
  conversationTurns.forEach((turn, turnIndex) => {
    // Only process Claude's responses (assistant turns)
    const isAssistantTurn = turn.querySelector('[data-testid="conversation-turn-assistant"]');
    if (!isAssistantTurn) return;
    
    // Find artifact containers
    const artifactContainers = turn.querySelectorAll('[data-testid="artifact-container"]');
    
    artifactContainers.forEach((container) => {
      const artifact = extractArtifactData(container, artifactIndex, turnIndex);
      if (artifact) {
        artifacts.push(artifact);
        artifactIndex++;
      }
    });
    
    // Also extract code blocks which might not be in artifact containers
    const codeBlocks = turn.querySelectorAll('pre code');
    codeBlocks.forEach((codeBlock) => {
      const artifact = extractCodeBlockData(codeBlock, artifactIndex, turnIndex);
      if (artifact) {
        artifacts.push(artifact);
        artifactIndex++;
      }
    });
  });
  
  console.log(`Extracted ${artifacts.length} artifacts`);
  return { success: true, artifacts };
}

// Extract data from an artifact container
function extractArtifactData(container, index, turnIndex) {
  // Try to get artifact title
  const titleElement = container.querySelector('[data-testid="artifact-title"]');
  const title = titleElement ? titleElement.textContent.trim() : `Artifact_${index}`;
  
  // Try to get artifact type
  let type = "unknown";
  let content = "";
  let language = "";
  
  // Check for code blocks
  const codeBlock = container.querySelector('pre code');
  if (codeBlock) {
    type = "code";
    content = codeBlock.textContent;
    
    // Try to determine language
    const classNames = codeBlock.className.split(' ');
    for (const className of classNames) {
      if (className.startsWith('language-')) {
        language = className.replace('language-', '');
        break;
      }
    }
  } else {
    // Check for other content types
    const textContent = container.textContent.trim();
    if (textContent) {
      type = "text";
      content = textContent;
    }
  }
  
  // Check for images
  const image = container.querySelector('img');
  if (image) {
    type = "image";
    content = image.src;
  }
  
  return {
    id: `artifact-${index}`,
    turnIndex,
    title,
    type,
    language,
    content,
    timestamp: new Date().toISOString()
  };
}

// Extract data from a code block
function extractCodeBlockData(codeBlock, index, turnIndex) {
  const content = codeBlock.textContent;
  if (!content.trim()) return null;
  
  // Try to determine language
  let language = "";
  const classNames = codeBlock.className.split(' ');
  for (const className of classNames) {
    if (className.startsWith('language-')) {
      language = className.replace('language-', '');
      break;
    }
  }
  
  // Generate a title based on language
  const title = language ? `Code_${language}_${index}` : `Code_${index}`;
  
  return {
    id: `code-${index}`,
    turnIndex,
    title,
    type: "code",
    language,
    content,
    timestamp: new Date().toISOString()
  };
}

// Format artifacts as JSON
function formatAsJson(artifacts) {
  const data = {
    meta: {
      exported_at: new Date().toISOString(),
      count: artifacts.length
    },
    artifacts
  };
  
  return JSON.stringify(data, null, 2);
}

// Format artifacts as Markdown
function formatAsMarkdown(artifacts) {
  if (!artifacts || artifacts.length === 0) {
    return "# Claude Artifacts\n\nNo artifacts found in this conversation.";
  }
  
  let markdown = "# Claude Artifacts\n\n";
  markdown += `Exported on: ${new Date().toLocaleString()}\n\n`;
  
  artifacts.forEach((artifact, index) => {
    markdown += `## ${artifact.title}\n\n`;
    
    if (artifact.type === "code") {
      markdown += `\`\`\`${artifact.language}\n${artifact.content}\n\`\`\`\n\n`;
    } else if (artifact.type === "image") {
      markdown += `![${artifact.title}](${artifact.content})\n\n`;
    } else {
      markdown += `${artifact.content}\n\n`;
    }
  });
  
  return markdown;
}
