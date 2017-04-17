const webpack = require('webpack');
const path = require('path');

const config = {
  entry: {
    settings: './src/js/search/settings.js',
    search: './src/js/search/search.js'
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
    })
  ]
};

if(process.env.NODE_ENV === 'production'){
  config.plugins.push(new webpack.optimize.UglifyJsPlugin());
  config.output.path = path.resolve(__dirname, 'build', 'js');
}
  
module.exports = config;