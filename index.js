const fs = require('fs');
const fetch = require('cross-fetch');

function getLinks(data, file){
  const regex = /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm;
  const capturarRegex = [...data.matchAll(regex)];
  const result = capturarRegex.map((match) => ({
    text: match[1],
    href: match[2],
    file: file
  }));
  return result;
}

function mdlinks(file, options = { validate: false, stats: false }) {
  return new Promise((resolve, reject) => {
    fs.promises.readFile(file, 'utf-8')
      .then((result) => {
        const links = getLinks(result, file);
        if (options.validate) {
          const requests = links.map((link) => validateLink(link));
          Promise.all(requests)
            .then((validatedLinks) => {
              if (options.stats) {
                const stats = getStats(validatedLinks);
                resolve({ links: validatedLinks, stats });
              } else {
                resolve(validatedLinks);
              }
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          if (options.stats) {
            const stats = getStats(links);
            resolve({ links, stats });
          } else {
            resolve(links);
          }
        }
      })
  });
}

function validateLink(link) {
  return fetch(link.href)
  .then((response) => {
    link.status = response.status;
    link.ok = 'OK';
    if(link.status >= 400){
      link.ok = 'FAIL';
    }
    return link;
  })
  .catch((erro) => {
    link.status = erro;
    link.ok = 'fail';
    return link;
  })
}

function getStats(links) {
  const total = links.length;
  const unique = [...new Set(links.map((link) => link.href))].length;
  const broken = links.filter((link) => link.ok === 'fail').length;
  return {
    total: total,
    unique: unique,
    broken: broken
  };
}

module.exports = mdlinks;

