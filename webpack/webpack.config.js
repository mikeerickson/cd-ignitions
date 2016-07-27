/**
 * webpack.config.js
 * Mike Erickson <codedungeon@gmail.com>
 * 2016.06.06 18:40 (mikee)
 * =============================================================================
 */

// Optional loaders
// - angular
// - less
// - sass

// Optional preLoaders
// stylelint
// eslint

var path                = require('path')
var ProgressBarPlugin   = require('progress-bar-webpack-plugin')
var CopyWebpackPlugin   = require('copy-webpack-plugin');
var BuildNotifierPlugin = require('webpack-build-notifier')
var ESLintWebpackPlugin = require('eslint-loader')
var msg                 = require('gulp-messenger')
var webpack             = require('webpack')

var outputPath     = path.join(__dirname, '/dist')
var outputFilename = 'bundle.js'
var publicPath     = outputPath

var webpackConfig = {
  context: __dirname + '/src',
  devtool: 'eval', // source-map
  entry:   './index.js',
  output: {
    path:       outputPath,
    filename:   outputFilename,
    publicPath: publicPath
  },
  // devServer: {
  //   contentBase: outputPath,
  //   hot: true
  // },
  module: {
    preLoaders: [
      // {test: /\.(less|css)$/, loader: 'stylelint' },
      {test: /\.js$/, loader: "eslint-loader", exclude: /node_modules/}
    ],
    loaders: [
      {test: /\.js?$/, loaders: [/* 'ng-annotate' */,'babel'], exclude: /node_modules/},
      {test: /\.html?$/, loaders: ['raw']},
      // {test: /\.less?$/, loaders: ['style!css!less?strictMath&noIeCompat']},
      {
        // test: /\.css$/,
        // loaders: [
        //   'style',
        //   'css?sourceMap&modules&localIdentName=[name]__[local]___[hash:base64:5]'
        // ]
      },
    ]
  },
  // stylelint: {
  //   configFile: path.join(__dirname, './.stylelintrc'),
  //   configOverrides: {
  //     rules: {
  //       // Your rule overrides here
  //     }
  //   }
  // },
  plugins: [

    // Display notification when build completed
    new BuildNotifierPlugin(),

    // Removes duplicate modules from the build
    new webpack.optimize.DedupePlugin(),

    // Configure ProgressBar
    new ProgressBarPlugin({
      format: msg.chalk.yellow.bold('  Building [:bar] ') + msg.chalk.green.bold(':percent') + msg.chalk.bold(' (:elapsed seconds)'),
      clear:   false,
      summary: true
    }),

    // Copy assets not part of bundle
    new CopyWebpackPlugin([
      { from: './index.html', to: './index.html' },
      { from: './fonts',      to: './fonts' },
      { from: './css',        to: './css' },
      { from: './data',       to: './data' },
    ]),

    // Compress build
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),

  ]
};

module.exports = webpackConfig;
