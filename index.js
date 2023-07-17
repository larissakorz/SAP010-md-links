const fs = require('fs');
const fetch = require('cross-fetch');
const path = require('path');

function getLinks(data, file){
  const regex = /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm;
  const capturarRegex = [...data.matchAll(regex)];
  const result = capturarRegex.map((match) => ({
    text: match[1],
    href: match[2],
    file: path.basename(file)
  }));
  return result;
}

function mdlinks(file, options) {
  return new Promise((resolve, reject) => {
    const currentDirectory = process.cwd();
    recursive(currentDirectory, file)
      .then((filePath) => {
        if (!filePath) {
          console.log(`O arquivo ${file} não é um arquivo md.`);
          resolve([]);
        } else {
          fileMarkdown(filePath, options)
            .then(resolve)
            .catch(reject);
        }
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
}

function recursive(directory, fileName, options) {
  return fs.promises.readdir(directory)
    .then((files) => {
      const filePromises = files.map((file) => {
        const filePath = path.join(directory, file);
        return fs.promises.stat(filePath)
          .then((stats) => {
            if (stats.isFile() && file === fileName && path.extname(file) === '.md') {
              return filePath;
            } else if (stats.isDirectory()) {
              return recursive(filePath, fileName, options);
            } else {
              return null;
            }
          });
      });
      return Promise.all(filePromises);
    })
    .then((results) => {
      const foundFile = results.find((filePath) => filePath !== null);
      return foundFile || null;
    })
    .catch((error) => {
      throw error;
    });
}

function fileMarkdown(filePath, options) {
  return new Promise((resolve, reject) => {
    fs.promises.readFile(filePath, 'utf8')
      .then((data) => {
        const links = getLinks(data, filePath);

        if (options && options.validate) {
          const linkPromises = links.map(validateLink);
          Promise.all(linkPromises)
            .then((validatedLinks) => {
              const stats = getStats(validatedLinks);
              resolve({ file: filePath, links: validatedLinks, stats });
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          const stats = getStats(links);
          resolve({ file: filePath, links, stats });
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
