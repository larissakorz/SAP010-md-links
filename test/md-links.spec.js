const { mdlinks, getStats, getLinks, validateLink } = require('../index')
const fetch = require('cross-fetch');

jest.mock('cross-fetch', () => jest.fn());

describe('getLinks', () => {
  it('deve retornar um array de objetos contendo os links', () => {
    const data = `
      [Google](https://www.google.com).
    `;

    const file = 'example.md';
    const expectedLinks = [
      {
        text: 'Google',
        href: 'https://www.google.com',
        file: 'example.md',
      },
    ];

    const links = getLinks(data, file);
    expect(links).toEqual(expectedLinks);
  });
});

describe('mdLinks', () => {
  it('deve retornar propriedades de um diretório válido', () => {
    const path = 'arquivos/teste/'
    const options = {};
    const result = mdlinks(path, options);
    return result.then((links) => {
     links.forEach((link) => {
       expect(link).toHaveProperty('href');
       expect(link).toHaveProperty('text');
       expect(link).toHaveProperty('file');
     });
    });
   });

   it('Deve rejeitar a promise para opções inválidas', () => {
    const filePath = '/arquivos/arquivo.md';
    const options = { invalidOption: true };

    expect(mdlinks(filePath, options)).rejects.toThrow('Opções inválidas');
  });

  it('deve retornar uma matriz de links com estatísticas quando a opção "stats" for fornecida', () => {
    const file = './arquivos/teste.md';
    const options = { stats: true };
    return mdlinks(file, options)
      .then((result) => {
        expect(Array.isArray(result.links)).toBe(true);
      });
  });

  it('deve retornar um array vazio quando for um caminho de arquivo vazio', () => {
    const file = './arquivos/semLink.md';
    const options = {};
    return mdlinks(file, options)
      .then((result) => {
        expect(result.length).toBe(0);
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

  it('Deve retornar o status "fail" quando a requisição falhar', () => {
    const url = {
      href: 'http://example.co',
    };

    mockFetch.mockRejectedValueOnce(('Request failed'));

    return validateLink(url).then((result) => {
      expect(result).toEqual({
        ...url,
        status: 'Request failed',
        ok: 'fail',
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
      { href: 'https://www.exemplo4.com', ok: 'fail' },
    ];

    const result = getStats(links);

    expect(result.total).toBe(5);
    expect(result.unique).toBe(4);
    expect(result.broken).toBe(2);
  });
})
