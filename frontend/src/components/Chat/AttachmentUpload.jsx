import React, { useRef, useState } from 'react';

const AttachmentUpload = ({ onUpload, disabled }) => {
  const [uploading, setUploading] = useState(false);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const documentInputRef = useRef(null);

  const handleFileSelect = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (20MB limit)
    if (file.size > 20 * 1024 * 1024) {
      alert('File size must be less than 20MB');
      return;
    }

    setUploading(true);
    try {
      await onUpload(file, type);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
      // Clear input
      e.target.value = '';
    }
  };

  return (
    <div className="attach-buttons">
      <label className="attach-btn" style={{ opacity: disabled || uploading ? 0.5 : 1 }}>
        📷 Image
        <input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={(e) => handleFileSelect(e, 'image')}
          disabled={disabled || uploading}
          style={{ display: 'none' }}
        />
      </label>

      <label className="attach-btn" style={{ opacity: disabled || uploading ? 0.5 : 1 }}>
        🎥 Video
        <input
          ref={videoInputRef}
          type="file"
          accept="video/mp4,video/webm"
          onChange={(e) => handleFileSelect(e, 'video')}
          disabled={disabled || uploading}
          style={{ display: 'none' }}
        />
      </label>

      <label className="attach-btn" style={{ opacity: disabled || uploading ? 0.5 : 1 }}>
        📁 Document
        <input
          ref={documentInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,.md"
          onChange={(e) => handleFileSelect(e, 'file')}
          disabled={disabled || uploading}
          style={{ display: 'none' }}
        />
      </label>

      {uploading && (
        <span style={{ fontSize: '0.75rem', color: '#3b82f6' }}>Uploading...</span>
      )}
    </div>
  );
};

export default AttachmentUpload;