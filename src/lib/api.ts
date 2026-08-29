import type { UploadResponse, QueryResponse } from '@/types';

const BASE_URL = 'https://pension-prodigal-tassel.ngrok-free.dev';

const DEFAULT_HEADERS: Record<string, string> = {
  'ngrok-skip-browser-warning': '69420',
  'Content-Type': 'application/json',
};

export async function uploadDocument(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    headers: {
      'ngrok-skip-browser-warning': '69420',
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
