module.exports = {
  publicPath: '/algodebug/',
  devServer: {
      proxy: {
        '/BACKEND': {
          target: 'http://localhost:8081/',
          pathRewrite: {'^/BACKEND' : ''}
        },
        '/COMPILATOR': {
          target: 'https://codex-api.herokuapp.com/',
          pathRewrite: {'^/COMPILATOR' : ''}
        }
    }
  }
}