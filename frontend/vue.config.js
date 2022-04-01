module.exports = {
  devServer: {
      proxy: {
        '/backend': {
          target: 'http://localhost:8080/',
          pathRewrite: {'^/backend' : ''}
        },
        '/compilator': {
          target: 'https://codexweb.netlify.app/',
          pathRewrite: {'^/compilator' : ''}
        }
    }
  }
}