#!/usr/bin/env node

const { program } = require('commander');
const mdlinks = require('./index');

program
  .arguments('<caminhoArquivo>')
  .action((caminhoArquivo) => {
    console.log('Comando mdlinks executado com sucesso!');
    mdlinks(caminhoArquivo);
  });

program.parse(process.argv);
