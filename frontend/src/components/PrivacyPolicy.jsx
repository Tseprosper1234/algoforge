import React from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="main-content" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <button className="back-btn" onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>
        ← Back
      </button>
      
      <div className="privacy-policy" style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '16px' }}>
        <h1>Privacy Policy for AlgoForge</h1>
        <p><strong>Last Updated:</strong> April 16, 2025</p>

        <h2>1. Introduction</h2>
        <p>Welcome to AlgoForge ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and share information when you use our educational platform.</p>

        <h2>2. Information We Collect</h2>
        <p>We collect the following information:</p>
        <ul>
          <li><strong>Account Information:</strong> Email address, username, and hashed password</li>
          <li><strong>Profile Information:</strong> Avatar images you upload</li>
          <li><strong>Learning Progress:</strong> Quiz scores and completed topics</li>
          <li><strong>Chat Messages:</strong> Messages you send in the community forum</li>
          <li><strong>Usage Data:</strong> Pages visited, time spent on platform</li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <ul>
          <li>To provide and maintain our educational services</li>
          <li>To notify you about new content and platform updates</li>
          <li>To improve user experience and platform performance</li>
          <li>To display personalized advertisements through Google AdSense</li>
          <li>To comply with legal obligations</li>
        </ul>

        <h2>4. Cookies and Tracking</h2>
        <p>We use cookies and similar tracking technologies to:</p>
        <ul>
          <li>Remember your login session</li>
          <li>Store your theme preferences (light/dark mode)</li>
          <li>Analyze site traffic through Google Analytics</li>
          <li>Serve relevant advertisements through Google AdSense</li>
        </ul>

        <h2>5. Third-Party Services</h2>
        <p>We use the following third-party services:</p>
        <ul>
          <li><strong>Supabase:</strong> For database and file storage</li>
          <li><strong>Google AdSense:</strong> For displaying advertisements</li>
          <li><strong>Brevo (Sendinblue):</strong> For sending email notifications</li>
          <li><strong>Render:</strong> For hosting the application</li>
        </ul>

        <h2>6. Data Security</h2>
        <p>We implement appropriate security measures including password hashing, HTTPS encryption, and secure database connections to protect your data.</p>

        <h2>7. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your account</li>
          <li>Opt-out of email notifications</li>
          <li>Disable cookies in your browser</li>
        </ul>

        <h2>8. Children's Privacy</h2>
        <p>AlgoForge is intended for users aged 13 and above. We do not knowingly collect information from children under 13.</p>

        <h2>9. Changes to This Policy</h2>
        <p>We may update this privacy policy periodically. We will notify users of significant changes via email or platform notification.</p>

        <h2>10. Contact Us</h2>
        <p>For privacy-related questions, contact us at: <strong>privacy@algoforge.com</strong></p>
        
        <h2>11. Google AdSense Disclosure</h2>
        <p>We use Google AdSense to display ads. Google uses cookies to serve ads based on your prior visits to our website and other websites. You may opt out of personalized advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google Ad Settings</a>.</p>
        
        <p style={{ marginTop: '30px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          By using AlgoForge, you consent to this privacy policy.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;