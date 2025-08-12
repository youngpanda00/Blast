// Suppress ResizeObserver loop error which is harmless but noisy
// This error occurs when ResizeObserver callbacks trigger changes that
// cause another ResizeObserver callback to fire, creating a loop

export const suppressResizeObserverErrors = () => {
  // Store original error handler
  const originalError = window.onerror;
  
  window.onerror = (message, source, lineno, colno, error) => {
    // Check if it's the ResizeObserver loop error
    if (typeof message === 'string' && 
        message.includes('ResizeObserver loop completed with undelivered notifications')) {
      // Suppress this specific error
      return true;
    }
    
    // Call original error handler for other errors
    if (originalError) {
      return originalError(message, source, lineno, colno, error);
    }
    
    return false;
  };
  
  // Also handle unhandled promise rejections that might contain this error
  const originalUnhandledRejection = window.onunhandledrejection;
  
  window.onunhandledrejection = (event) => {
    if (event.reason && typeof event.reason === 'string' && 
        event.reason.includes('ResizeObserver loop completed with undelivered notifications')) {
      event.preventDefault();
      return;
    }
    
    if (originalUnhandledRejection) {
      originalUnhandledRejection(event);
    }
  };
};

// Initialize error suppression
suppressResizeObserverErrors();
