import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from './ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      let errorMessage = "Une erreur inattendue est survenue.";
      let errorDetails = "";

      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error) {
            errorMessage = "Erreur de base de données";
            errorDetails = parsed.error;
          }
        }
      } catch (e) {
        // Not a JSON error
        errorMessage = this.state.error?.message || errorMessage;
      }

      if (this.state.error?.message === 'SILENT_ERROR') {
        return this.props.children;
      }

      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-white rounded-[32px] border border-gray-100 shadow-sm m-6">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="text-red-500" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-text-main mb-4">{errorMessage}</h2>
          {errorDetails && (
            <p className="text-gray-500 mb-8 max-w-md font-mono text-sm bg-gray-50 p-4 rounded-xl border border-gray-100">
              {errorDetails}
            </p>
          )}
          <Button 
            onClick={this.handleReset}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl"
          >
            <RefreshCcw size={20} />
            Recharger l'application
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
