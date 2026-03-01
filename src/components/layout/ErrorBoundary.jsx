import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Error Boundary — catches React render errors
 * Prevents entire app from crashing if one component fails
 */
export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <div className="error-boundary__content">
                        <AlertTriangle size={32} style={{ color: '#f6465d' }} />
                        <h3 className="error-boundary__title">Something went wrong</h3>
                        <p className="error-boundary__message">
                            {this.state.error?.message || 'An unexpected error occurred'}
                        </p>
                        <button className="error-boundary__retry" onClick={this.handleRetry}>
                            <RefreshCw size={14} />
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
