const REQUEST_TIMEOUT = 15_000;

async function fetchResponse(url, headers) {
  const response = await fetch(url, {
    headers,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT),
  });

  if (!response.ok) {
    throw new Error(`Request to ${url} failed with ${response.status} ${response.statusText}`);
  }

  return response;
}

export async function fetchJson(url, headers = {}) {
  const response = await fetchResponse(url, headers);
  return response.json();
}

export async function fetchText(url, headers = {}) {
  const response = await fetchResponse(url, headers);
  return response.text();
}
