export default function Header() {
  return (
    <header className="dashboard-header">
      <div className="header-content">
        <div className="logo">
          <h1>PipeOps</h1>
          <p>DevOps Dashboard</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">Refresh</button>
          <button className="btn-primary">Deploy New</button>
        </div>
      </div>
    </header>
  );
}