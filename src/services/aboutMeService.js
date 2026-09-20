import env from '@/config/env.js';

export async function fetchAboutMe({ signal } = {}) {
  const response = await fetch(env.aboutMeUrl, {
    signal,
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

export default fetchAboutMe;
