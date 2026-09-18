import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main className="not-found">
      <h1>404</h1>
      <p>The page you requested could not be found in FacultyPortal.</p>
      <Link to="/app/dashboard" className="btn btn-primary">
        Return to Dashboard
      </Link>
    </main>
  );
}
