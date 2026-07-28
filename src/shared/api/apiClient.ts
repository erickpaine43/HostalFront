const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7036/api';

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const textBody = await response.text();
      let errorMessage = `Error ${response.status}: ${response.statusText}`;

      if (textBody && textBody.trim().length > 0) {
        const contentType = response.headers.get('content-type') || '';

        
        if (contentType.includes('text/plain')) {
          errorMessage = textBody;
        } else {
          try {
           
            const errorJson = JSON.parse(textBody);
            
            if (errorJson.errors) {
              const firstKey = Object.keys(errorJson.errors)[0];
              if (firstKey && Array.isArray(errorJson.errors[firstKey]) && errorJson.errors[firstKey][0]) {
                errorMessage = errorJson.errors[firstKey][0];
              }
            } else {
              errorMessage = errorJson.mensaje || errorJson.message || errorJson.title || textBody;
            }
          } catch {
           
            errorMessage = textBody;
          }
        }
      }

      
      errorMessage = errorMessage.replace(/^["']|["']$/g, '').trim();
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    console.error(`[API Error] en ${endpoint}:`, error);
    throw error;
  }
}