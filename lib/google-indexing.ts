import { JWT } from 'google-auth-library';

const GOOGLE_API_SCOPE = 'https://www.googleapis.com/auth/indexing';
const INDEXING_API_ENDPOINT = 'https://indexing.googleapis.com/v3/urlNotifications:publish';

// Initialize JWT client with service account credentials
const auth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: [GOOGLE_API_SCOPE],
});

export type IndexingType = 'URL_UPDATED' | 'URL_DELETED';

export async function submitUrlToIndex(url: string, type: IndexingType = 'URL_UPDATED') {
  try {
    const response = await auth.request({
      url: INDEXING_API_ENDPOINT,
      method: 'POST',
      data: {
        url,
        type,
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Error submitting URL to Google Indexing API:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
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