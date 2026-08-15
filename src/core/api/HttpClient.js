/**
 * HttpClient — тонкая обёртка над fetch.
 * Единое место для базового URL, таймаута, заголовков и обработки ошибок.
 */
export class HttpError extends Error {
  constructor(status, message, url) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.url = url;
  }
}

export default class HttpClient {
  constructor(baseUrl = '/api', timeout = 5000) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  async request(path, { method = 'GET', body, headers = {} } = {}) {
    const url = `${this.baseUrl}${path}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', ...headers },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new HttpError(response.status, `Помилка запиту: ${response.status}`, url);
      }
      if (response.status === 204) return null;
      return await response.json();
    } finally {
      clearTimeout(timer);
    }
  }

  get(path) { return this.request(path); }
  post(path, body) { return this.request(path, { method: 'POST', body }); }
  put(path, body) { return this.request(path, { method: 'PUT', body }); }
  patch(path, body) { return this.request(path, { method: 'PATCH', body }); }
  delete(path) { return this.request(path, { method: 'DELETE' }); }
}
