import React from 'react';
import ReactMarkdown from 'react-markdown';

const NotesTab = ({ notes }) => {
  if (!notes) {
    return <div className="notes-content">No notes available for this topic.</div>;
  }
  
  return (
    <div className="notes-content">
      <ReactMarkdown>{notes}</ReactMarkdown>
    </div>
  );
};

export default NotesTab;