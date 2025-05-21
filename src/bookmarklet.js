// Claude Artifacts Extractor - Bookmarklet
// This is a bookmarklet version of the extractor that can be saved as a bookmark

javascript:(function(){
  // Check if we're on Claude.ai
  if (!window.location.href.includes("claude.ai")) {
    alert("This bookmarklet only works on Claude.ai");
    return;
  }
  
  console.log("Claude Artifacts Extractor Bookmarklet activated");
  
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
  
  // Download artifacts as a file
  function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }
  
  // Run the extraction
  const result = extractClaudeArtifacts();
  
  if (result.error) {
    alert(`Error extracting artifacts: ${result.error}`);
    return;
  }
  
  if (result.artifacts.length === 0) {
    alert('No artifacts found in this conversation.');
    return;
  }
  
  // Ask user which format they want
  const format = confirm('Click OK to download as JSON, Cancel for Markdown') ? 'json' : 'md';
  
  if (format === 'json') {
    const json = formatAsJson(result.artifacts);
    downloadFile(json, 'claude-artifacts.json', 'application/json');
  } else {
    const markdown = formatAsMarkdown(result.artifacts);
    downloadFile(markdown, 'claude-artifacts.md', 'text/markdown');
  }
})();
