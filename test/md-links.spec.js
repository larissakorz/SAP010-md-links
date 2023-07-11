const getLinks = require('../index');
const fetch = require('cross-fetch');

jest.mock('cross-fetch', () => jest.fn());

describe('mdlinks', () => {
  let mockFetch;

  beforeEach(() => {
    mockFetch = jest.fn();
    fetch.mockImplementation(mockFetch)
  });

  it('Deve extrair corretamente os links', () => {
    const caminho = 'teste.md';

    mockFetch.mockResolvedValueOnce({
      status: 200,
      ok: true
    });

    return getLinks(caminho).then((result) => {
      expect(result[0]).toEqual(
        { text: 'Markdown', href: 'https://pt.wikipedia.org/wiki/Markdown', file: 'teste.md' }
      );
    });
  });
});
