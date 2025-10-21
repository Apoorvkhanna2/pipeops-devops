// frontend/src/app/webhooks/page.tsx
'use client';

export default function Webhooks() {
  const webhookConfig = {
    url: 'https://api.pipeops.dev/webhook/github',
    content_type: 'json',
    secret: 'your-webhook-secret',
    events: ['push', 'pull_request', 'deployment']
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Webhook Configuration</h1>
        <p>Set up GitHub webhooks for real-time deployments</p>
      </div>

      <div className="grid-2">
        <div className="card">
          <h2>GitHub Webhook Setup</h2>
          <div className="config-item">
            <label>Payload URL</label>
            <code className="code-block">{webhookConfig.url}</code>
          </div>
          <div className="config-item">
            <label>Content Type</label>
            <code className="code-block">{webhookConfig.content_type}</code>
          </div>
          <div className="config-item">
            <label>Secret</label>
            <code className="code-block">{webhookConfig.secret}</code>
          </div>
          <div className="config-item">
            <label>Events</label>
            <div className="events-list">
              {webhookConfig.events.map(event => (
                <span key={event} className="event-tag">{event}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Quick Start Guide</h2>
          <ol className="guide-steps">
            <li>Go to your GitHub repository Settings</li>
            <li>Click on "Webhooks" in the left sidebar</li>
            <li>Click "Add webhook"</li>
            <li>Enter the Payload URL above</li>
            <li>Set Content type to "application/json"</li>
            <li>Add the secret key</li>
            <li>Select "Let me select individual events"</li>
            <li>Choose the events listed above</li>
            <li>Click "Add webhook"</li>
          </ol>
        </div>
      </div>

      <style jsx>{`
        .code-block {
          display: block;
          background: rgba(255, 255, 255, 0.1);
          padding: 0.75rem;
          border-radius: 6px;
          font-family: 'Monaco', 'Consolas', monospace;
          color: #f8fafc;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .events-list {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .event-tag {
          background: rgba(79, 172, 254, 0.2);
          color: #4facfe;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          border: 1px solid rgba(79, 172, 254, 0.3);
        }

        .guide-steps {
          padding-left: 1.5rem;
          color: #cbd5e1;
        }

        .guide-steps li {
          margin-bottom: 0.5rem;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}