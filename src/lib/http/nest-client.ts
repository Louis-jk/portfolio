type RequestOptions = {
  cache?: RequestCache;
  signal?: AbortSignal;
  body?: unknown;
};

export class NestApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body?: unknown,
  ) {
    super(message);
    this.name = 'NestApiError';
  }
}

function getBaseUrl(): string {
  const url = process.env.NEST_API_URL ?? process.env.API_URL;
  if (!url?.trim()) {
    throw new NestApiError('NEST_API_URL is not configured', 503);
  }
  return url.trim().replace(/\/$/, '');
}

async function parseJsonBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

async function request<T>(
  method: string,
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;

  const response = await fetch(url, {
    method,
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: options.cache ?? 'no-store',
    signal: options.signal,
  });

  const body = await parseJsonBody(response);

  if (!response.ok) {
    const bodyMessage =
      typeof body === 'object' && body !== null && 'message' in body
        ? (body as { message: unknown }).message
        : undefined;

    const message = Array.isArray(bodyMessage)
      ? bodyMessage.join('; ')
      : typeof bodyMessage === 'string'
        ? bodyMessage
        : `Nest API error (${response.status})`;

    throw new NestApiError(message, response.status, body);
  }

  // 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return body as T;
}

export const nestClient = {
  get<T>(path: string, options?: Omit<RequestOptions, 'body'>) {
    return request<T>('GET', path, options);
  },

  post<T>(path: string, body: unknown, options?: Omit<RequestOptions, 'body'>) {
    return request<T>('POST', path, { ...options, body });
  },

  put<T>(path: string, body: unknown, options?: Omit<RequestOptions, 'body'>) {
    return request<T>('PUT', path, { ...options, body });
  },

  patch<T>(
    path: string,
    body: unknown,
    options?: Omit<RequestOptions, 'body'>,
  ) {
    return request<T>('PATCH', path, { ...options, body });
  },

  delete(path: string, options?: Omit<RequestOptions, 'body'>) {
    return request<void>('DELETE', path, options);
  },
};
