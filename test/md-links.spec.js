const mdlinks = require('../index');

describe('mdlinks', () => {
  it('Deve extrair corretamente os links', () => {
    const caminho = 'test/teste.md';
    const resultadoEsperado = [
      {
        href: 'https://pt.wikipedia.org/wiki/Markdown',
        text: 'Markdown',
        file: caminho,
      },
      {
        href: 'https://www.linkedin.com/',
        text: 'Linkedin',
        file: caminho,
      },
      {
        href: 'https://www.youtube.com/',
        text: 'Youtube',
        file: caminho,
      },
    ];

    return mdlinks(caminho).then((links) => {
      expect(links).toEqual(resultadoEsperado);
    });
  });
});

describe('mdlinks', () => {
  it('Deve buscar o arquivo .md', () => {
    const caminho = 'test/teste.md';
    return mdlinks(caminho).then((links) => {
        links.forEach((link) => {
          expect(link.file).toBe(caminho);
        });
      })
  });
});
