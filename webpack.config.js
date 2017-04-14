var webpack = require('webpack');
var path = require('path');
var AssetsPlugin = require('assets-webpack-plugin');

module.exports = function(env) {
  var config = {
    entry: {
      settings: './lib/pages/search/settings.js',
      search: './lib/pages/search/search.js',
      'save.fs': './lib/pages/save/fs/index.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['env','es2015','react']
            }
          }
        }
      ]
    },
    output: {
      filename: '[name].[chunkhash].js',
      path: path.resolve(__dirname, 'assets', 'js')
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: function (module) {
          // this assumes your vendor imports exist in the node_modules directory
          return module.context && module.context.indexOf('node_modules') !== -1;
        }
      }),
      // CommonChunksPlugin will now extract all the common modules from vendor and main bundles
      // But since there are no more common modules between them we end up with just the runtime code included in the manifest file
      new webpack.optimize.CommonsChunkPlugin({ 
        name: 'manifest',
      }),
      new AssetsPlugin()
    ]
  };
  
  if(env && env.production){
    config.plugins.push(new webpack.optimize.UglifyJsPlugin());
  }
  
  return config;
};