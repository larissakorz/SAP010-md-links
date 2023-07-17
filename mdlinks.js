#!/usr/bin/env node
const mdlinks = require('./index');

const caminhoArquivo = process.argv[2];
const options = {
  validate: process.argv.includes('--validate'),
  stats: process.argv.includes('--stats')
};

mdlinks(caminhoArquivo, options)
  .then(({ links, stats }) => {
    if (options.validate && options.stats) {
      console.log(`TOTAL: ${stats.total}`);
      console.log(`UNIQUE: ${stats.unique}`);
      console.log(`BROKEN: ${stats.broken}`);
    } else if (options.stats) {
      console.log(`Total: ${stats.total}`);
      console.log(`Unique: ${stats.unique}`);
    } else if (options.validate) {
      links.forEach((link) => {
        console.log(`${link.file} ${link.href} ${link.text} ${link.ok} ${link.status}`);
        console.log('=======================');
      });
    } else {
      links.forEach((link) => {
        console.log(`TEXTO: ${link.text}`);
        console.log(`HREF: ${link.href}`);
        console.log(`FILE: ${link.file}`);
        console.log('=======================');
      });
    }
  })
  .catch((error) => {
    console.error(error);
  });

