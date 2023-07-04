#!/usr/bin/env node

const { program } = require('commander');
const pacote = require('./package.json');

program.version(pacote.version);
program
  .arguments('<arquivo>')
  .action((arquivo) => {
    console.log('Comando mdlinks executado com sucesso!');
    console.log('Arquivo:', arquivo);
  });

program.parse(process.argv);
