// LER ARQUIVO
const fs = require('fs')

fs.readFile('./README.md', 'utf8' , (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  // console.log(data)
  const regex = /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm
  const links = data.match(regex);
  console.log(links);
})


// // EXTENSAO DE UM ARQUIVO
// const path = require('path');

// const caminhoArquivo = './src/exemplo.txt';
// const extensao = path.extname(caminhoArquivo);
// console.log(extensao);

// // Obter o conteúdo de um diretório
// fs.readdir('./src/', (err, files) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   console.log(files);
// });

// // Definir rotas
// require('path').dirname('./src/exemplo.txt')
