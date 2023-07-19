const { mdlinks, getStats, validateLink } = require('../index')
const fetch = require('cross-fetch');

jest.mock('cross-fetch', () => jest.fn());

describe('mdLinks', () => {
  test('devera devolver uma promisse', () => {
    const resultado = mdlinks('README.md')
    expect(resultado instanceof Promise).toBe(true)
  });

  test('devera devolver o caso de erro', () => {
    const path = './arquivos/teste.md';
    const options = {};

    return mdlinks(path, options)
      .then(() => {
        throw new Error('Esperava-se um erro, mas não houve.');
      })
      .catch((error) => {
        expect(error).toBeInstanceOf(Error);
      });
  });
});

describe('validateFetch', () => {
  let mockFetch;

  beforeEach(() => {
    mockFetch = jest.fn();
    fetch.mockImplementation(mockFetch);
  });


  describe('validateFetch', () => {
    it('Deve validar corretamente os links md', () => {
      const links = { text: 'Markdown', href: 'http://example.com', file: 'README.md' };

      mockFetch.mockResolvedValueOnce({
        status: 200,
        ok: true,
      });

      return validateLink(links).then((result) => {
        expect(result).toEqual(
          { text: 'Markdown', href: 'http://example.com', file: 'README.md', status: 200, ok: 'OK' },
        );
      });
    });
  });
})

describe('getStats', () => {
  it('deve retornar as estatísticas corretas para uma lista de links', () => {
    const links = [
      { href: 'https://www.exemplo1.com', ok: 'success' },
      { href: 'https://www.exemplo2.com', ok: 'success' },
      { href: 'https://www.exemplo3.com', ok: 'fail' },
      { href: 'https://www.exemplo4.com', ok: 'success' },
      { href: 'https://www.exemplo5.com', ok: 'fail' },
    ];

    const result = getStats(links);

    expect(result.total).toBe(5);
    expect(result.unique).toBe(4);
    expect(result.broken).toBe(2);
  });
})
