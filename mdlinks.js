#!/usr/bin/env node
const { mdlinks } = require('./index');
const chalk = require('chalk')

const caminhoArquivo = process.argv[2];
const options = {
  validate: process.argv.includes('--validate'),
  stats: process.argv.includes('--stats')
};

mdlinks(caminhoArquivo, options)
  .then((links) => {
    if (options.validate && options.stats) {
      console.log(chalk.green(`TOTAL: ${links.stats.total}`));
      console.log(chalk.yellow(`UNIQUE: ${links.stats.unique}`));
      console.log(chalk.blue(`BROKEN: ${links.stats.broken}`));
    } else if (options.stats) {
        console.log(chalk.yellow(`TOTAL: ${links.stats.total}`));
        console.log(chalk.blue(`UNIQUE: ${links.stats.unique}`));
    } else if (options.validate) {
        links.forEach((link) => {
          console.log(chalk.magenta(`${link.file}`));
          console.log(`${link.href}`);
          console.log(chalk.yellow(`${link.text}`));
          console.log(`${link.ok}`);
          console.log(chalk.blue(`${link.status}`));
          console.log('=======================');
        })
    } else {
        links.forEach((link) => {
          console.log(`TEXTO: ${link.text}`);
          console.log(`HREF: ${link.href}`);
          console.log(`FILE: ${link.file}`);
          console.log('============================');
        })
      }
    })
    .catch((error) => {
      console.error(error);
  });
