module.exports = {
  devServer: {
      proxy: {
        '/backend': {
          target: 'http://localhost:8081/',
          pathRewrite: {'^/backend' : ''}
        },
        '/compilator': {
          target: 'https://codexweb.netlify.app/',
          pathRewrite: {'^/compilator' : ''}
        }
    }
  }
}