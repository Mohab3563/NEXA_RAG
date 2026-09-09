import type { UploadResponse, QueryResponse } from '@/types';

const BASE_URL = 'https://nexadeploy-production.up.railway.app';

const DEFAULT_HEADERS: Record<string, string> = {
  'ngrok-skip-browser-warning': '69420',
  'Content-Type': 'application/json',
};

/**
 * Helper to get or create a unique persistent user ID using localStorage.
 * This guarantees that separate browser profiles/accounts have completely
 * independent workspaces without sharing state.
 */
function getUserId(): string {
  let userId = localStorage.getItem('nexa_user_id');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substring(2, 11);
    localStorage.setItem('nexa_user_id', userId);
  }
  return userId;
}

/**
 * Triggers the backend cleanup route using navigator.sendBeacon
 * to wipe user files and vectors upon page refresh or tab closure.
 */
export function cleanupWorkspace(): void {
  const userId = localStorage.getItem('nexa_user_id');
  if (userId) {
    const url = `${BASE_URL}/cleanup/${userId}`;
    // sendBeacon fires reliably during browser teardown/refresh
    navigator.sendBeacon(url);
  }
}

export async function uploadDocument(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('user_id', getUserId()); // Attach the isolated user ID

  const res = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    headers: {
      'ngrok-skip-browser-warning': '69420',
      // Note: Do NOT set Content-Type here; browser sets it automatically with the boundary for FormData
    },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Upload failed (${res.status}): ${text || res.statusText}`);
  }

  return res.json();
}

export async function queryRag(
  query: string,
  mode: string,
  selectedDocument: string,
): Promise<QueryResponse> {
  const res = await fetch(`${BASE_URL}/query`, {
    method: 'POST',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify({
      query,
      user_id: getUserId(), // Pass the user ID in the JSON body
      mode,
      selected_document: selectedDocument,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Query failed (${res.status}): ${text || res.statusText}`);
  }

  return res.json();
}
