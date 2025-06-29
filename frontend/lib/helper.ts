type keyType = string | number | symbol;
export function transformArrayToObject<T, K extends keyof T>(array: T[], key: K): Record<T[K] & (keyType), T> {
  return array.reduce<Record<T[K] & (string | number | symbol), T>>((acc, item) => {
    const keyValue = item[key];
    if (typeof keyValue === 'string' || typeof keyValue === 'number') {
      acc[keyValue] = item;
    } else {
      throw new Error(`Key value of type ${typeof keyValue} is not a valid object key.`);
    }
    return acc;
  }, {} as Record<T[K] & (string | number | symbol), T>);
};

export function isProd() {
  return process.env.NEXT_PUBLIC_ENVIRONMENT == "production";
};

export function getApiURL() {
  return (isProd() ? process.env.NEXT_PUBLIC_PROD_URL : process.env.NEXT_PUBLIC_DEV_URL) ?? "http://localhost:8080";
};

export async function fetchTk(url: string, options: RequestInit = {}) {
  try {
    const isCompleteUrl = url.startsWith('http://') || url.startsWith('https://');
    if (!isCompleteUrl) {
      url = getApiURL() + url;
    }

    return fetch(url, options);
  } catch (error) {
    console.error('unable to fetch token', error);
    throw error;
  }
}
export interface GetUserByFirebaseOptions {
  firebaseUserId: string;
  createUser?: boolean;
  userData?: object;
}

export async function getUserByFirebaseUserId({
  firebaseUserId,
  createUser = false,
  userData,
}: GetUserByFirebaseOptions) {
  const baseUrl = getApiURL();
  const url = `${baseUrl}/api/usuarios/firebase/${firebaseUserId}`;
  const opts: RequestInit = {
    method: createUser ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  if (createUser && userData) {
    opts.body = JSON.stringify(userData);
  }
  const res = await fetch(url, opts);
  if (!res.ok) {
    throw new Error('Failed to fetch user');
  }
  return res.json();
}