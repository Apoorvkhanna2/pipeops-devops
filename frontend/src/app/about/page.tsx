// frontend/src/app/about/page.tsx
'use client';

export default function About() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>About PipeOps</h1>
        <p>Modern DevOps monitoring and service management platform</p>
      </div>

      <div className="about-content">
        <div className="about-card">
          <h2>🚀 Our Mission</h2>
          <p>
            PipeOps is designed to simplify DevOps monitoring and service management 
            for modern cloud-native applications. We provide real-time insights into 
            your infrastructure, applications, and deployment pipelines.
          </p>
        </div>

        <div className="about-card">
          <h2>🛠 Features</h2>
          <ul className="features-list">
            <li>Real-time service monitoring and alerts</li>
            <li>Deployment pipeline tracking</li>
            <li>Performance metrics and analytics</li>
            <li>Automated anomaly detection</li>
            <li>Multi-environment support</li>
            <li>Customizable dashboards</li>
          </ul>
        </div>

        <div className="about-card">
          <h2>📊 Technology Stack</h2>
          <div className="tech-grid">
            <div className="tech-item">
              <strong>Frontend:</strong> Next.js 15, React, TypeScript
            </div>
            <div className="tech-item">
              <strong>Backend:</strong> Node.js, Express, WebSocket
            </div>
            <div className="tech-item">
              <strong>Database:</strong> PostgreSQL, Redis
            </div>
            <div className="tech-item">
              <strong>Monitoring:</strong> Prometheus, Grafana
            </div>
            <div className="tech-item">
              <strong>Infrastructure:</strong> Docker, Kubernetes
            </div>
            <div className="tech-item">
              <strong>Cloud:</strong> AWS, Azure, GCP compatible
            </div>
          </div>
        </div>

        <div className="about-card">
          <h2>👥 Team</h2>
          <p>
            Built by DevOps enthusiasts who understand the challenges of 
            managing complex microservices architectures and cloud infrastructure.
          </p>
        </div>

        <div className="about-card">
          <h2>📞 Get in Touch</h2>
          <p>
            Have questions or suggestions? We'd love to hear from you!
          </p>
          <div className="contact-info">
            <div>📧 Email: contact@pipeops.dev</div>
            <div>🐙 GitHub: github.com/pipeops</div>
            <div>📚 Documentation: docs.pipeops.dev</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .page-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem;
        }

        .page-header {
          margin-bottom: 3rem;
          text-align: center;
        }

        .page-header h1 {
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(45deg, #fff, #e0e7ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1rem;
        }

        .page-header p {
          color: #94a3b8;
          font-size: 1.2rem;
        }

        .about-content {
          display: grid;
          gap: 2rem;
        }

        .about-card {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 2rem;
          backdrop-filter: blur(10px);
        }

        .about-card h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #f8fafc;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .about-card p {
          color: #cbd5e1;
          line-height: 1.7;
          font-size: 1.1rem;
        }

        .features-list {
          list-style: none;
          padding: 0;
        }

        .features-list li {
          padding: 0.5rem 0;
          color: #cbd5e1;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          position: relative;
          padding-left: 1.5rem;
        }

        .features-list li:before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #10b981;
          font-weight: bold;
        }

        .tech-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
        }

        .tech-item {
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .tech-item strong {
          color: #4facfe;
        }

        .contact-info {
          display: grid;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .contact-info div {
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 768px) {
          .page-header h1 {
            font-size: 2rem;
          }
          
          .tech-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}