import React from 'react';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="main-content" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <button className="back-btn" onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>
        ← Back
      </button>
      
      <div style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '16px' }}>
        <h1>Terms of Service</h1>
        <p><strong>Effective Date:</strong> April 16, 2025</p>

        <h2>1. Acceptance of Terms</h2>
        <p>By accessing or using AlgoForge, you agree to be bound by these Terms of Service.</p>

        <h2>2. Description of Service</h2>
        <p>AlgoForge provides educational content on algorithms, data structures, and complexity analysis, including interactive examples, quizzes, and a community forum.</p>

        <h2>3. User Accounts</h2>
        <ul>
          <li>You must be at least 13 years old to create an account</li>
          <li>You are responsible for maintaining account security</li>
          <li>You agree to provide accurate registration information</li>
          <li>You may not share your account credentials</li>
        </ul>

        <h2>4. User Conduct</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Post inappropriate, offensive, or harmful content in the forum</li>
          <li>Attempt to bypass security measures</li>
          <li>Use the platform for illegal activities</li>
          <li>Harass other users or staff</li>
          <li>Upload malicious files or content</li>
        </ul>

        <h2>5. Content Ownership</h2>
        <ul>
          <li>Educational content on AlgoForge is owned by the platform</li>
          <li>User-generated content (forum messages, profile pictures) remains yours</li>
          <li>We may moderate or remove inappropriate user content</li>
        </ul>

        <h2>6. Disclaimer of Warranties</h2>
        <p>The service is provided "as is" without warranties. We do not guarantee uninterrupted access or error-free operation.</p>

        <h2>7. Limitation of Liability</h2>
        <p>AlgoForge is not liable for any indirect, incidental, or consequential damages arising from your use of the service.</p>

        <h2>8. Termination</h2>
        <p>We may suspend or terminate accounts for violating these terms. You may delete your account at any time.</p>

        <h2>9. Changes to Terms</h2>
        <p>We may modify these terms. Continued use constitutes acceptance of changes.</p>

        <h2>10. Contact</h2>
        <p>Questions about terms? Contact: <strong>legal@algoforge.com</strong></p>
      </div>
    </div>
  );
};

export default TermsOfService;