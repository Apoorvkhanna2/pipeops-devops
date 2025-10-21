// frontend/src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PipeOps DevOps Dashboard',
  description: 'Real-time monitoring and service management platform',
  keywords: 'devops, monitoring, deployment, ci/cd, kubernetes, docker',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body suppressHydrationWarning>
        <div className="app-container">
          <nav className="navbar">
            <div className="nav-container">
              <div className="nav-logo">
                <span className="logo-text">PipeOps</span>
                <span className="logo-badge">DevOps</span>
              </div>
              
              <div className="nav-links">
                <a href="/" className="nav-link">
                  <span className="nav-icon">📊</span>
                  Dashboard
                </a>
                <a href="/deployments" className="nav-link">
                  <span className="nav-icon">🚀</span>
                  Deployments
                </a>
                <a href="/devops-tools" className="nav-link">
                  <span className="nav-icon">🔧</span>
                  DevOps Tools
                </a>
                <a href="/monitoring" className="nav-link">
                  <span className="nav-icon">📈</span>
                  Monitoring
                </a>
                <a href="/webhooks" className="nav-link">
                  <span className="nav-icon">🔗</span>
                  Webhooks
                </a>
                <a href="/settings" className="nav-link">
                  <span className="nav-icon">⚙️</span>
                  Settings
                </a>
                <a href="/about" className="nav-link">
                  <span className="nav-icon">ℹ️</span>
                  About
                </a>
              </div>

              <div className="nav-actions">
                <div className="status-indicator">
                  <div className="status-dot online"></div>
                  <span>System Online</span>
                </div>
                <button className="notification-btn">
                  <span className="nav-icon">🔔</span>
                  <span className="notification-badge">3</span>
                </button>
                <div className="user-profile">
                  <div className="avatar">U</div>
                </div>
              </div>
            </div>
          </nav>

          <main className="main-content">
            {children}
          </main>

          <footer className="footer">
            <div className="footer-container">
              <div className="footer-content">
                <div className="footer-section">
                  <h3>PipeOps</h3>
                  <p>Modern DevOps monitoring and service management platform</p>
                </div>
                <div className="footer-section">
                  <h4>Features</h4>
                  <a href="/deployments">Deployments</a>
                  <a href="/monitoring">Monitoring</a>
                  <a href="/devops-tools">DevOps Tools</a>
                  <a href="/webhooks">Webhooks</a>
                </div>
                <div className="footer-section">
                  <h4>Support</h4>
                  <a href="/documentation">Documentation</a>
                  <a href="/help">Help Center</a>
                  <a href="/contact">Contact</a>
                </div>
                <div className="footer-section">
                  <h4>Connect</h4>
                  <div className="social-links">
                    <a href="#" className="social-link">GitHub</a>
                    <a href="#" className="social-link">Twitter</a>
                    <a href="#" className="social-link">LinkedIn</a>
                  </div>
                </div>
              </div>
              <div className="footer-bottom">
                <p>&copy; 2024 PipeOps DevOps Dashboard. All rights reserved.</p>
                <div className="footer-links">
                  <a href="/privacy">Privacy Policy</a>
                  <a href="/terms">Terms of Service</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}