import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('Faculty Portal UI Error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="error-boundary">
          <h1>We encountered an unexpected error.</h1>
          <p>Please refresh the page. If this continues, contact IT support.</p>
          <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
            Reload Portal
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}
