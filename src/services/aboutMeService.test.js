import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchAboutMe } from './aboutMeService.js';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('aboutMeService', () => {
  it('returns parsed JSON from the endpoint', async () => {
    const payload = { fullName: 'Taras Okres', nickname: 'configbast1' };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => payload }),
    );

    await expect(fetchAboutMe()).resolves.toEqual(payload);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('throws when the server answers with an error status', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) }),
    );

    await expect(fetchAboutMe()).rejects.toThrow('HTTP 500');
  });
});
