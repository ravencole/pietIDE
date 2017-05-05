import express from 'express';
import webpack from 'webpack';
import path from 'path';
import config from './webpack.config.dev';
import open from 'open';

require('babel-polyfill')

require('dotenv').config({path: './.env'});

const app = express();
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(express.static(__dirname + '/src'));
app.use(require('webpack-hot-middleware')(compiler));

app.get('*', function(req, res) {
  res.sendFile(path.join( __dirname, './src/index.html'));
});

app.listen(process.env.PORT, function(err) {
  if (err) {
    console.log(err);
  } else {
    open(`${process.env.HOSTNAME}:${process.env.PORT}`);
  }
});