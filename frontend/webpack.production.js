const path = require('path'),
HtmlWebpackPlugin = require('html-webpack-plugin'),
MinifyPlugin = require("babel-minify-webpack-plugin"),
OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'),
CompressionPlugin = require("compression-webpack-plugin"),
webpack = require('webpack'),
MiniCssExtractPlugin = require("mini-css-extract-plugin");;

const plugins =
[
  new MinifyPlugin(),
  new HtmlWebpackPlugin(
  {  
    filename: 'index.html',
    favicon: "./public/favicon.ico",
    template: './public/index.html', 
  }),
  new CompressionPlugin({ test: /\.js(\?.*)?$/i,}),
  new MiniCssExtractPlugin()
]

const rules = 
[
  {
    test: /\.(js|jsx)$/,
    include: path.resolve(__dirname, 'src'),
    loader: 'babel-loader',
  },
  { 
    test: /\.(sa|sc|c)ss$/,
    use: 
    [
      {
        loader:"style-loader"
      },
      {
        loader: MiniCssExtractPlugin.loader
      },
      {
        loader: "css-loader", 
      },
      {
        loader: "resolve-url-loader"
      },
      {
        loader: 'sass-loader',
        options: {
          sourceMap: true,
          sourceMapContents: false,
          includePaths: ["node_modules/bourbon/core"]
        },
      }
    ]
  },
  
  {
    test: /\.(png|jpe?g|gif)$/i,
    loader: 'file-loader',
    options: {
      outputPath: 'static/images'
    }
  },
  {
    test: /\.(svg)$/i,
    loader: 'file-loader',
    options: {
      outputPath: 'static/icons'
    }
  },
  {
    test: /\.(json)$/i,
    loader: 'file-loader',
  },
  {
    test: /\.(ttf)$/i,
    loader: 'file-loader',
    options: {
      outputPath: 'static/fonts'
    }
  },
]


module.exports = 
{
  optimization: 
  {
    minimizer: [new OptimizeCSSAssetsPlugin({})],
    splitChunks: {
      chunks: 'all'
    }
  },
  entry: path.resolve(__dirname, "./src/index.js"),
  output: 
  {
    path: __dirname + '/build',
    publicPath: '/',
    filename: "static/js/bundle.js"
  },
  plugins: plugins,
  module: 
  {
    rules: rules,
  }
}


