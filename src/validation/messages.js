const SEPARATOR = '::';

export function message(key, params) {
  return params ? `${key}${SEPARATOR}${JSON.stringify(params)}` : key;
}

export function translateError(t, raw) {
  if (!raw) return null;

  const [key, params] = String(raw).split(SEPARATOR);
  if (!key.startsWith('validation.')) return String(raw);

  try {
    return t(key, params ? JSON.parse(params) : undefined);
  } catch {
    return t(key);
  }
}

export default message;
