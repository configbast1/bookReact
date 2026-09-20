export function localized(value, language = 'ru') {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  return value[language] ?? value.ru ?? value.en ?? '';
}

export default localized;
