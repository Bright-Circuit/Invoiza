/**
 * API Helper Utilities
 */

/**
 * Build query string from params object
 */
export function buildQueryString(params) {
  if (!params || Object.keys(params).length === 0) {
    return '';
  }

  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, v));
      } else {
        searchParams.append(key, value);
      }
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Format error message from API response
 */
export function formatErrorMessage(error) {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}

/**
 * Check if response is successful
 */
export function isSuccessResponse(response) {
  return (
    response &&
    (response.success === true ||
      response.data?.success === true ||
      (response.status >= 200 && response.status < 300))
  );
}

/**
 * Extract data from API response
 */
export function extractResponseData(response) {
  if (response.data?.data) {
    return response.data.data;
  }
  
  if (response.data) {
    return response.data;
  }
  
  return response;
}

/**
 * Format form data for API submission
 */
export function formatFormData(formData) {
  const data = new FormData();
  
  Object.entries(formData).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (value instanceof File) {
        data.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((item) => {
          data.append(key, item);
        });
      } else if (typeof value === 'object') {
        data.append(key, JSON.stringify(value));
      } else {
        data.append(key, value);
      }
    }
  });
  
  return data;
}

/**
 * Retry failed API request
 */
export async function retryRequest(requestFn, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
    }
  }
}

/**
 * Debounce function for API calls
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
