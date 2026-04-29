import React from 'react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="main-content" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <button className="back-btn" onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>
        ← Back
      </button>
      
      <div style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '16px' }}>
        <h1>About AlgoForge</h1>
        
        <h2>📚 Our Mission</h2>
        <p>AlgoForge is dedicated to making computer science education accessible, interactive, and engaging for learners worldwide. We believe that mastering algorithms and data structures should be an exciting journey, not a daunting challenge.</p>
        
        <h2>🎯 What We Offer</h2>
        <ul>
          <li><strong>Interactive Learning:</strong> Hands-on examples and visual demonstrations</li>
          <li><strong>Multi-language Support:</strong> Code examples in Python, JavaScript, C++, and Java</li>
          <li><strong>Community Forum:</strong> Connect with fellow learners, ask questions, and share knowledge</li>
          <li><strong>Quizzes & Assessments:</strong> Test your understanding and track your progress</li>
          <li><strong>Real-time Demos:</strong> Visualize algorithms in action</li>
        </ul>
        
        <h2>👨‍💻 Who We Are</h2>
        <p>AlgoForge was created by a team of passionate developers and educators who recognized the need for a modern, interactive platform to learn algorithms and data structures. We combine our expertise in software development and teaching to create the best learning experience possible.</p>
        
        <h2>✨ Key Features</h2>
        <ul>
          <li><strong>Algorithm Library:</strong> Comprehensive coverage of sorting, searching, and graph algorithms</li>
          <li><strong>Data Structures:</strong> In-depth explanations of arrays, linked lists, trees, graphs, and more</li>
          <li><strong>Complexity Analysis:</strong> Understand time and space complexity with practical examples</li>
          <li><strong>Dark/Light Mode:</strong> Choose your preferred viewing experience</li>
          <li><strong>Mobile Responsive:</strong> Learn on any device, anywhere</li>
        </ul>
        
        <h2>📧 Contact Us</h2>
        <p>Have questions, feedback, or suggestions? Reach out to us:</p>
        <ul>
          <li>Email: <strong>support@algoforge.com</strong></li>
          <li>GitHub: <strong>https://github.com/Tseprosper1234/algoforge</strong></li>
        </ul>
        
        <h2>🌟 Our Vision</h2>
        <p>To become the go-to platform for anyone learning algorithms and data structures, providing a supportive community and cutting-edge interactive tools that make complex concepts simple and enjoyable.</p>
        
        <h2>📅 Version</h2>
        <p>AlgoForge v1.0.0 | Released April 2025</p>
        
        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid var(--border)', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <p>© 2025 AlgoForge. Made with ❤️ for learners everywhere.</p>
        </div>
      </div>
    </div>
  );
};

export default About;