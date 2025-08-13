// Utility functions for checkout API with improved error handling and retry logic

export interface SaveStepData {
  stepName: string;
  data: {
    dataList: Array<{
      data: string;
      packageType: string;
    }>;
    duration: number;
    paymentMode: string;
  };
}

export interface SaveStepResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export const saveStepWithRetry = async (
  stepData: SaveStepData,
  maxRetries: number = 3
): Promise<SaveStepResponse> => {
  console.log("Starting save step process for:", stepData);

  let response: Response;
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    try {
      response = await fetch("/api-blast/task/save-step", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stepData),
      });
      
      if (response.ok) {
        const data = await response.json().catch(() => ({}));
        console.log("Step data saved successfully");
        return { success: true, data };
      }
      
      // If not successful, check if we should retry
      if (response.status >= 500 && retryCount < maxRetries - 1) {
        retryCount++;
        console.warn(`Save step attempt ${retryCount} failed with status ${response.status}, retrying...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
        continue;
      }
      
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`Failed to save step data (HTTP ${response.status}): ${errorText}`);
      
    } catch (fetchError: any) {
      retryCount++;
      if (retryCount >= maxRetries) {
        console.error("All retry attempts failed:", fetchError.message);
        return { 
          success: false, 
          error: fetchError.message || 'Network error occurred'
        };
      }
      console.warn(`Save step attempt ${retryCount} failed:`, fetchError.message, "- retrying...");
      await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
    }
  }
  
  return { success: false, error: 'Maximum retry attempts exceeded' };
};

export const showErrorNotification = (message: string, title: string = "Error") => {
  // Remove any existing error notifications
  const existingError = document.querySelector('#checkout-error-toast');
  if (existingError) {
    existingError.remove();
  }

  // Create error notification
  const errorToast = document.createElement('div');
  errorToast.id = 'checkout-error-toast';
  errorToast.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: #dc2626;
      color: white;
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 9999;
      font-size: 14px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 12px;
      max-width: 400px;
      animation: slideIn 0.3s ease-out;
    ">
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
      </svg>
      <div>
        <div style="font-weight: 600; margin-bottom: 4px;">${title}</div>
        <div style="opacity: 0.9;">${message}</div>
        <div style="opacity: 0.8; margin-top: 4px; font-size: 12px;">Please try again or contact support if the issue persists.</div>
      </div>
    </div>
    <style>
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    </style>
  `;

  document.body.appendChild(errorToast);

  // Auto remove after 8 seconds
  setTimeout(() => {
    if (errorToast && errorToast.parentNode) {
      errorToast.style.animation = 'slideIn 0.3s ease-out reverse';
      setTimeout(() => errorToast.remove(), 300);
    }
  }, 8000);
};

export const getUserFriendlyErrorMessage = (error: Error): string => {
  const message = error.message.toLowerCase();
  
  if (message.includes("failed to save step data")) {
    return "Unable to save your selection. Please check your connection and try again.";
  } else if (message.includes("fetch") || message.includes("network")) {
    return "Network error occurred. Please check your internet connection.";
  } else if (message.includes("timeout")) {
    return "Request timed out. Please try again.";
  } else if (message.includes("http 5")) {
    return "Server error occurred. Please try again in a moment.";
  } else if (message.includes("http 4")) {
    return "Invalid request. Please refresh the page and try again.";
  }
  
  return "Something went wrong during checkout.";
};
