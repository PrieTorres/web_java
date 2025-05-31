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
  return (isProd() ? process.env.NEXT_PUBLIC_PROD_URL : process.env.NEXT_PUBLIC_DEV_URL) ?? "http://localhost:3000";
};

export async function fetchTk(url: string, options?: object) {
  try {
    const headers = {
      ...(options ?? {}),
    };

    return fetch(url, {
      headers,
      ...options
    });

  } catch (error) {
    console.error("unable to fetch token", error);
    throw error;
  }
}