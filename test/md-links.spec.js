/* eslint-disable no-undef */
const mdlinks = require('../index')

const testeLinks = [
  {
    href: "https://pt.wikipedia.org/wiki/Markdown",
    text: "Markdown",
    file: './teste.md',
  },
  {
    href: "https://www.linkedin.com/",
    text: "Linkedin",
    file: './teste.md',
  },
  {
    href: "https://www.youtube.",
    text: "Youtube",
    file: './teste.md',
  },
];

describe('mdLinks', () => {

  it("retorna um array de objetos", () => {
    const data = mdlinks('./teste.md',);
    expect(data).resolves.toEqual(testeLinks);
  });
});

describe('mdlinks', () => {
  test('deve retornar um array vazio para um arquivo sem links', () => {
    const emptyFilePath = './src/teste/testSemLink.md'
    const options = { validate: true, stats: true }

    return mdlinks(emptyFilePath, options)
      .then((result) => {
        expect(result).toEqual({ links: [], stats: { broken: 0, total: 0, unique: 0 } })
      })
  })
})
