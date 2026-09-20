export const FORMAT_VALUES = ['paper', 'ebook', 'audio'];

export const GENRE_KEYS = {
  'Поезія': 'poetry',
  'Класика': 'classics',
  'Фентезі': 'fantasy',
  'Антиутопія': 'dystopia',
  'Нонфікшн': 'nonfiction',
  'Програмування': 'programming',
  'Дитяча література': 'children',
  'Фантастика': 'scifi',
  'Роман': 'novel',
  'Підліткова література': 'teen',
  'Сучасна проза': 'modernProse',
};

export function genreLabel(t, genre) {
  const key = GENRE_KEYS[genre];
  return key ? t(`genre.${key}`) : genre;
}

export function formatLabel(t, format) {
  return FORMAT_VALUES.includes(format) ? t(`format.${format}`) : format;
}

export function formatOptions(t) {
  return FORMAT_VALUES.map((value) => ({ value, label: t(`format.${value}`) }));
}

export function genreOptions(t, genres) {
  return genres
    .map((value) => ({ value, label: genreLabel(t, value) }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
