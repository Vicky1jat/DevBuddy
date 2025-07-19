import { useState } from "react";


export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const [languageId, setLanguageId] = useState(54);
  const [isCompilerMode, setIsCompilerMode] = useState(false);
 

  const loadTemplate = () => {
    setIsCompilerMode(true);
    let template = '';
    switch (languageId) {
      case 54: // C++
        template = `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  // your code here\n  return 0;\n}`;
        break;
      case 63: // JavaScript
        template = `// JavaScript Starter\nfunction main() {\n  // your code here\n}\n\nmain();`;
        break;
      case 62: // Java
        template = `public class Main {\n    public static void main(String[] args) {\n        // your code here\n    }\n}`;
        break;
      case 71: // Python
        template = `def main():\n    # your code here\n\nif __name__ == \"__main__\":\n    main()`;
        break;
      case 50: // C
        template = `#include <stdio.h>\n\nint main() {\n    // your code here\n    return 0;\n}`;
        break;
      default:
        template = '';
    }
    setPrompt(template);
  };



  const handleAsk = async () => {
    if (isCompilerMode) {
      // exit compiler mode and clear template
      setIsCompilerMode(false);
      setPrompt('');
      return;
    }
    setError('');
    setResponse('');
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const contentType = res.headers.get('content-type') || '';
      let data;

      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(`Server returned non-JSON response (${res.status}): ${text.slice(0, 100)}`);
      }

      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setResponse(data.result);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const runCode = async () => {
    setIsCompilerMode(true);
    setLoading(true);
    setError('');
    setOutput('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/run-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ languageId, sourceCode: prompt, stdin: '' }),
      });
      const data = await res.json();
      setOutput(data.stdout || data.stderr || data.compile_output || 'No output');
    } catch (err) {
      setError('Execution failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={styles.container}>
      {/* Animated background elements */}
      <div style={styles.backgroundOverlay}>
        <div style={styles.backgroundElement1}></div>
        <div style={styles.backgroundElement2}></div>
      </div>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>🧠</span>
          </div>
          <h1 style={styles.title}>DevBuddy</h1>
        </div>
        <button style={styles.headerButton}>
          Get Started
        </button>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Hero Section */}
        <div style={styles.heroSection}>
          <h2 style={styles.heroTitle}>
            Your Personal AI Coding Assistant
          </h2>
          
          
          {/* Feature Cards */}
          <div style={styles.featureGrid}>
            <div style={styles.featureCard}>
              <span style={styles.featureIcon}>💻</span>
              <h3 style={styles.featureTitle}>Code Explanation</h3>
              <p style={styles.featureDescription}>Understand complex code with AI-powered explanations</p>
            </div>
            <div style={styles.featureCard}>
              <span style={styles.featureIcon}>🚀</span>
              <h3 style={styles.featureTitle}>DSA Problems</h3>
              <p style={styles.featureDescription}>Solve data structures and algorithms efficiently</p>
            </div>
            <div style={styles.featureCard}>
              <span style={styles.featureIcon}>🧮</span>
              <h3 style={styles.featureTitle}>Complexity Analysis</h3>
              <p style={styles.featureDescription}>Analyze time and space complexity instantly</p>
            </div>
          </div>
        </div>

        {/* AI Assistant Interface */}
        <div style={styles.assistantSection}>
          {/* Robot Avatar */}
          <div style={styles.robotSection}>
            <div style={styles.robotAvatar}>
              🤖
            </div>
            <p style={styles.robotText}>Hi! I'm your AI coding assistant. What can I help you with today?</p>
          </div>

          {/* Input Section */}
          <div style={styles.inputSection}>
            <textarea
              rows={6}
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                if (isCompilerMode) setIsCompilerMode(false);
              }}
              placeholder={isCompilerMode ? 'Edit your code...' : "Paste your code or ask a question"}
              style={styles.textarea}
            />
            
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button
              onClick={handleAsk}
              disabled={loading || !prompt.trim()}
              style={{
                ...styles.askButton,
                ...(loading || !prompt.trim() ? styles.askButtonDisabled : {})
              }}
            >
              {loading ? (
                <div style={styles.loadingContainer}>
                  <div style={styles.spinner}></div>
                  Thinking...
                </div>
              ) : (
                'Ask DevBuddy ✨'
              )}
            </button>
            <button onClick={loadTemplate} style={styles.askButton} disabled={loading}>
              Compiler
            </button>
            </div>
          </div>
           

          <div style={{ marginTop: '1rem' }}>
            <label htmlFor="language-select" style={{ marginRight: '0.5rem' }}>Language:</label>
            <select
              id="language-select"
              value={languageId}
              onChange={(e) => setLanguageId(Number(e.target.value))}
              style={{ padding: '0.5rem', borderRadius: '0.5rem' }}
            >
              <option value={54}>C++</option>
              <option value={63}>JavaScript</option>
              <option value={62}>Java</option>
              <option value={71}>Python</option>
              <option value={50}>C</option>
            </select>
          </div>

          <button
            onClick={runCode}
            disabled={loading || !prompt.trim()}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(to right, #22c55e, #3b82f6)',
              border: 'none',
              borderRadius: '1rem',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
            Run Code ▶️
          </button>



          {/* Error Message */}
          {error && (
            <div style={styles.errorBox}>
              <p style={styles.errorText}>{error}</p>
            </div>
          )}

          {/* Response */}
          {response && (
            <div style={styles.responseBox}>
              <div style={styles.responseHeader}>
                <div style={styles.responseAvatar}>
                  🤖
                </div>
                <h3 style={styles.responseTitle}>DevBuddy's Response</h3>
              </div>
              <div style={styles.responseContent}>
                <pre style={styles.responseText}>{response}</pre>
              </div>
            </div>
          )}

          {output && (
            <div style={styles.responseBox}>
              <div style={styles.responseHeader}>
                <div style={styles.responseAvatar}>📤</div>
                <h3 style={styles.responseTitle}>Execution Output</h3>
              </div>
              <div style={styles.responseContent}>
                <pre style={styles.responseText}>{output}</pre>
              </div>
            </div>
          )}


        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <h3 style={styles.footerTitle}>Ready to boost your coding?</h3>
          <p style={styles.footerSubtitle}>Join thousands of developers using DevBuddy</p>
          
          <div style={styles.buttonContainer}>
            <button style={styles.socialButton}>
              <span style={styles.socialIcon}>🐙</span>
              <span style={styles.socialText}>Continue with GitHub</span>
            </button>
            <button style={styles.socialButton}>
              <span style={styles.socialIcon}>🦊</span>
              <span style={styles.socialText}>Continue with GitLab</span>
            </button>
            <button style={styles.socialButton}>
              <span style={styles.socialIcon}>🌐</span>
              <span style={styles.socialText}>Continue with Google</span>
            </button>
          </div>
          
          <p style={styles.footerDisclaimer}>
            By registering, you agree to our{' '}
            <a href="#" style={styles.footerLink}>Terms of Service</a>
            {' '}and{' '}
            <a href="#" style={styles.footerLink}>Privacy Policy</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #0f172a, #581c87, #0f172a)',
    color: 'white',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    position: 'relative',
  },
  backgroundOverlay: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  backgroundElement1: {
    position: 'absolute',
    top: '-10rem',
    right: '-10rem',
    width: '20rem',
    height: '20rem',
    background: '#a855f7',
    borderRadius: '50%',
    mixBlendMode: 'multiply',
    filter: 'blur(40px)',
    opacity: 0.2,
    animation: 'pulse 2s infinite',
  },
  backgroundElement2: {
    position: 'absolute',
    bottom: '-10rem',
    left: '-10rem',
    width: '20rem',
    height: '20rem',
    background: '#3b82f6',
    borderRadius: '50%',
    mixBlendMode: 'multiply',
    filter: 'blur(40px)',
    opacity: 0.2,
    animation: 'pulse 2s infinite',
  },
  header: {
    position: 'relative',
    zIndex: 10,
    padding: '1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  logo: {
    padding: '0.5rem',
    background: 'linear-gradient(to right, #a855f7, #3b82f6)',
    borderRadius: '0.5rem',
  },
  logoIcon: {
    fontSize: '1.25rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    background: 'linear-gradient(to right, #c084fc, #93c5fd)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: 0,
  },
  headerButton: {
    padding: '0.5rem 1.5rem',
    background: 'linear-gradient(to right, #a855f7, #3b82f6)',
    borderRadius: '9999px',
    fontWeight: '600',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  main: {
    position: 'relative',
    zIndex: 10,
    flex: 1,
    padding: '2rem',
    textAlign: 'center',
  },
  heroSection: {
    maxWidth: '64rem',
    margin: '0 auto 3rem',
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    background: 'linear-gradient(to right, #ffffff, #e9d5ff, #bfdbfe)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    lineHeight: 1.2,
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    color: '#d1d5db',
    marginBottom: '2rem',
    maxWidth: '32rem',
    margin: '0 auto 2rem',
    lineHeight: 1.6,
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem',
  },
  featureCard: {
    padding: '1.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    borderRadius: '1rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  featureIcon: {
    fontSize: '2rem',
    marginBottom: '1rem',
    display: 'block',
  },
  featureTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    margin: '0 0 0.5rem 0',
  },
  featureDescription: {
    color: '#9ca3af',
    fontSize: '0.875rem',
    margin: 0,
  },
  assistantSection: {
    maxWidth: '64rem',
    margin: '0 auto',
  },
  robotSection: {
    marginBottom: '2rem',
  },
  robotAvatar: {
    width: '5rem',
    height: '5rem',
    margin: '0 auto',
    background: 'linear-gradient(to right, #a855f7, #3b82f6)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.5rem',
    marginBottom: '1rem',
    animation: 'bounce 1s infinite',
  },
  robotText: {
    color: '#d1d5db',
    fontSize: '1.125rem',
    margin: 0,
  },
  inputSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    borderRadius: '1.5rem',
    padding: '2rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  textarea: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '1rem',
    padding: '1.5rem',
    color: 'white',
    fontSize: '1.125rem',
    resize: 'none',
    outline: 'none',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  askButton: {
    marginTop: '1.5rem',
    padding: '1rem 2rem',
    borderRadius: '1rem',
    fontWeight: '600',
    fontSize: '1.125rem',
    transition: 'all 0.3s ease',
    background: 'linear-gradient(to right, #a855f7, #3b82f6)',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  askButtonDisabled: {
    background: '#6b7280',
    cursor: 'not-allowed',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  spinner: {
    width: '1.25rem',
    height: '1.25rem',
    border: '2px solid white',
    borderTop: '2px solid transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  errorBox: {
    marginTop: '1.5rem',
    padding: '1rem',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '1rem',
    backdropFilter: 'blur(10px)',
  },
  errorText: {
    color: '#fca5a5',
    margin: 0,
  },
  responseBox: {
    marginTop: '2rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '1.5rem',
    padding: '2rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  responseHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  responseAvatar: {
    width: '2rem',
    height: '2rem',
    background: 'linear-gradient(to right, #34d399, #60a5fa)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
  },
  responseTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    margin: 0,
  },
  responseContent: {
    textAlign: 'left',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '1rem',
    padding: '1.5rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  responseText: {
    whiteSpace: 'pre-wrap',
    color: '#e5e7eb',
    lineHeight: 1.6,
    margin: 0,
    fontFamily: 'inherit',
  },
  footer: {
    position: 'relative',
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(10px)',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '3rem 0',
  },
  footerContent: {
    maxWidth: '64rem',
    margin: '0 auto',
    textAlign: 'center',
    padding: '0 2rem',
  },
  footerTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    margin: '0 0 0.5rem 0',
  },
  footerSubtitle: {
    color: '#9ca3af',
    marginBottom: '2rem',
    margin: '0 0 2rem 0',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
    marginBottom: '2rem',
  },
  socialButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1rem',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    color: 'white',
    fontSize: '0.875rem',
  },
  socialIcon: {
    fontSize: '1.25rem',
  },
  socialText: {
    fontWeight: '600',
  },
  footerDisclaimer: {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: 0,
  },
  footerLink: {
    color: '#c084fc',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
  },
};

// Add CSS animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes pulse {
    0%, 100% { opacity: 0.2; }
    50% { opacity: 0.3; }
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .feature-card:hover {
    background-color: rgba(255, 255, 255, 0.1) !important;
  }
  
  .header-button:hover {
    background: linear-gradient(to right, #9333ea, #2563eb) !important;
    transform: scale(1.05) !important;
  }
  
  .ask-button:hover:not(:disabled) {
    background: linear-gradient(to right, #9333ea, #2563eb) !important;
    transform: scale(1.05) !important;
  }
  
  .social-button:hover {
    background-color: rgba(255, 255, 255, 0.1) !important;
    transform: scale(1.05) !important;
  }
  
  .footer-link:hover {
    color: #a855f7 !important;
  }
  
  textarea::placeholder {
    color: #9ca3af;
  }
  
  textarea:focus {
    outline: none;
    ring: 2px solid #a855f7;
    border-color: transparent;
  }
  
  @media (max-width: 768px) {
    .hero-title {
      font-size: 2rem !important;
    }
    
    .feature-grid {
      grid-template-columns: 1fr !important;
    }
    
    .button-container {
      flex-direction: column !important;
      align-items: center !important;
    }
  }
`;
document.head.appendChild(styleSheet);