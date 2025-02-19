import { JWT } from 'google-auth-library';

const GOOGLE_API_SCOPE = 'https://www.googleapis.com/auth/indexing';
const INDEXING_API_ENDPOINT = 'https://indexing.googleapis.com/v3/urlNotifications:publish';
const INSPECTION_API_ENDPOINT = 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect';

interface GoogleApiError extends Error {
  response?: {
    status: number;
    statusText: string;
    data: any;
    headers: any;
  };
}

// Initialize JWT client with service account credentials
const auth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: [GOOGLE_API_SCOPE],
});

export type IndexingType = 'URL_UPDATED' | 'URL_DELETED';

export async function submitUrlToIndex(url: string, type: IndexingType = 'URL_UPDATED') {
  try {
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) {
      throw new Error('Missing Google Service Account credentials');
    }

    console.log('Attempting to submit URL:', url);
    console.log('Using service account:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);

    const response = await auth.request({
      url: INDEXING_API_ENDPOINT,
      method: 'POST',
      data: {
        url,
        type,
      },
    });

    console.log('Indexing API response:', response.data);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    const apiError = error as GoogleApiError;
    
    // Enhanced error logging for Google API errors
    if (apiError.response) {
      console.error('Google API Error Details:', {
        status: apiError.response.status,
        statusText: apiError.response.statusText,
        data: apiError.response.data,
        headers: apiError.response.headers,
      });
    }

    console.error('Detailed error submitting URL to Google Indexing API:', {
      error: apiError instanceof Error ? {
        message: apiError.message,
        stack: apiError.stack,
        name: apiError.name,
        response: apiError.response?.data
      } : apiError,
      url,
      type
    });

    return {
      success: false,
      error: apiError instanceof Error ? apiError.message : 'Unknown error',
      details: apiError.response?.data || apiError
    };
  }
}

export async function submitUrlsToIndex(urls: string[], type: IndexingType = 'URL_UPDATED') {
  const results = await Promise.allSettled(
    urls.map(url => submitUrlToIndex(url, type))
  );

  return results.map((result, index) => ({
    url: urls[index],
    ...result,
  }));
}

export async function checkUrlIndexStatus(url: string) {
  try {
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) {
      throw new Error('Missing Google Service Account credentials');
    }

    console.log('Checking indexing status for URL:', url);
    console.log('Using service account:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);

    const response = await auth.request({
      url: INSPECTION_API_ENDPOINT,
      method: 'POST',
      data: {
        inspectionUrl: url,
        siteUrl: 'https://themidnightspa.com/'
      },
    });

    console.log('Inspection API response:', response.data);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    const apiError = error as GoogleApiError;
    
    if (apiError.response) {
      console.error('Google API Error Details:', {
        status: apiError.response.status,
        statusText: apiError.response.statusText,
        data: apiError.response.data,
        headers: apiError.response.headers,
      });
    }

    return {
      success: false,
      error: apiError instanceof Error ? apiError.message : 'Unknown error',
      details: apiError.response?.data || apiError
    };
  }
} 