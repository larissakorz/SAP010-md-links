const fs = require('fs');
const path = require('path');

function mdlinks(file) {
  return new Promise((resolve, reject) => {
    if(path.extname(file) === '.md') {
      fs.readFile(file, 'utf8', function(err, data) {
        if(data) {
          const regex = /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm;
          const links = [];
          let match;
          while ((match = regex.exec(data)) !== null) {
            const text = match[1];
            const href = match[2];
            links.push({ text, href, file });
          }

          console.log(links);
          resolve(links);
        }
      });
    }
  }
)}

module.exports = mdlinks;

