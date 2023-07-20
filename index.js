const fs = require('fs');
const fetch = require('cross-fetch');
const path = require('path');
const chalk = require('chalk')

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

function directory(file) {
  return new Promise((resolve, reject) => {
    fs.promises.stat(file)
      .then((stats) => resolve(stats.isDirectory()))
      .catch(() => resolve(false));
  });
}

function mdlinks(file, options) {
  return new Promise((resolve, reject) => {
    directory(file)
      .then((isDir) => {
        if (isDir) {
          fs.promises.readdir(file)
            .then((files) => {
              const filePromises = files.map((filename) => {
                const filePath = path.join(file, filename);
                return mdlinks(filePath, options);
              });
              Promise.all(filePromises)
                .then((fileResults) => {
                  const allLinks = fileResults.reduce((acc, links) => acc.concat(links), []);
                  if (options.stats) {
                    const stats = getStats(allLinks);
                    resolve({ links: allLinks, stats });
                  } else {
                    resolve(allLinks);
                  }
                })
                .catch((error) => {
                  reject(error);
                });
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          const pathExist = path.extname(file).toLowerCase();
          if (pathExist === '.md') {
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
                } else {
                  if (options.stats) {
                    const stats = getStats(links);
                    resolve({ links, stats });
                  } else {
                    resolve(links);
                  }
                }
              })
              .catch(() => {
                console.log('Este caminho não existe');
              });
          } else {
            console.log('Este arquivo não é um arquivo .md');
          }
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function validateLink(link) {
  return fetch(link.href)
  .then((response) => {
    link.status = response.status;
    link.ok = chalk.green('OK');
    if(link.status >= 400){
      link.ok = chalk.red('fail');
    }
    return link;
  })
  .catch((erro) => {
    link.status = chalk.red('erro');
    link.ok = chalk.red('fail');
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

module.exports = {
  mdlinks,
  validateLink,
  getStats,
  getLinks
}
