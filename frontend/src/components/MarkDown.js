// frontend/src/components/MarkdownParser.js
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const MarkdownContainer = styled.div`
  line-height: 1.6;
  
  h1, h2, h3, h4, h5, h6 {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
  }
  
  p {
    margin-bottom: 1em;
  }
  
  ul, ol {
    margin-bottom: 1em;
    padding-left: 2em;
  }
  
  blockquote {
    border-left: 4px solid #ccc;
    padding-left: 1em;
    margin-left: 0;
    color: #666;
  }
  
  code {
    background-color: #f0f0f0;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: monospace;
  }
  
  pre {
    background-color: #f0f0f0;
    padding: 1em;
    border-radius: 5px;
    overflow-x: auto;
    margin-bottom: 1em;
  }
  
  pre code {
    background-color: transparent;
    padding: 0;
  }
  
  hr {
    border: 0;
    border-top: 1px solid #ccc;
    margin: 2em 0;
  }
  
  table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 1em;
  }
  
  th, td {
    border: 1px solid #ccc;
    padding: 0.5em;
    text-align: left;
  }
  
  th {
    background-color: #f0f0f0;
  }
`;

const InternalLink = styled(Link)`
  color: #0066cc;
  text-decoration: none;
  border-bottom: 1px dotted #0066cc;
  
  &:hover {
    border-bottom: 1px solid #0066cc;
  }
`;

const MarkdownParser = ({ content, notes = [] }) => {
  // Simple markdown parsing - we'll enhance this later
  const parseMarkdown = (text) => {
    if (!text) return '';
    
    // Process internal links [[Note Title]] or [[Note ID]]
    let processed = text.replace(/\[\[(.*?)\]\]/g, (match, title) => {
      // Find the note by title or ID
      const linkedNote = notes.find(note => 
        note.title === title || note._id === title
      );
      
      if (linkedNote) {
        return `<a href="/note/${linkedNote._id}" class="internal-link">${linkedNote.title}</a>`;
      }
      
      return `<span class="broken-link">${title}</span>`;
    });
    
    // Headers
    processed = processed.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
    processed = processed.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    processed = processed.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    processed = processed.replace(/^#### (.*?)$/gm, '<h4>$1</h4>');
    processed = processed.replace(/^##### (.*?)$/gm, '<h5>$1</h5>');
    processed = processed.replace(/^###### (.*?)$/gm, '<h6>$1</h6>');
    
    // Bold and Italic
    processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Lists
    processed = processed.replace(/^- (.*?)$/gm, '<li>$1</li>');
    processed = processed.replace(/(<li>.*?<\/li>)\n(?!<li>)/g, '$1</ul>\n');
    processed = processed.replace(/(?<!<\/ul>\n)(<li>)/g, '<ul>$1');
    
    // Code blocks
    processed = processed.replace(/```(.*?)\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre><code class="language-${lang}">${code}</code></pre>`;
    });
    
    // Inline code
    processed = processed.replace(/`(.*?)`/g, '<code>$1</code>');
    
    // Blockquotes
    processed = processed.replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>');
    
    // Links
    processed = processed.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
    
    // Paragraphs - ensure proper spacing between paragraphs
    processed = processed.replace(/\n\n(.*?)\n\n/g, '</p><p>$1</p><p>');
    
    // Wrap the content in paragraph tags if it's not already wrapped
    if (!processed.startsWith('<')) {
      processed = `<p>${processed}</p>`;
    }
    
    return processed;
  };
  
  return (
    <MarkdownContainer dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }} />
  );
};

export default MarkdownParser;