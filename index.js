const fs = require('fs');
const path = require('path');

function mdlinks(directory) {
  if(path.extname(directory) === '.md') {
    fs.readFile(directory, 'utf8', function(err, data) {
      if(data) {
        const regex = /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm;
        const links = data.match(regex);
        console.log(directory, links);
      }else {
        return err
      }
    });
  }
}

const directory = './caminho/do/diretorio';
mdlinks(directory);

module.exports = mdlinks;

