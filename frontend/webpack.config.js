const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const plugins =
[
  new HtmlWebpackPlugin(
  {  
    filename: 'index.html',
    favicon: "./public/favicon.ico",
    template: 'public/index.html', 
  }),
]

const rules = 
[
  {
    test: /\.js$/,
    include: path.resolve(__dirname, 'src'),
    loader: 'babel-loader',
  },

  { 
    test: /\.(sa|sc|c)ss$/,
    use: 
    [
      {
        loader: "style-loader"
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
      outputPath: 'images'
    }
  },
  {
    test: /\.(svg)$/i,
    loader: 'file-loader',
    options: {
      outputPath: 'icons'
    }
  },
  {
    test: /\.(ttf)$/i,
    loader: 'file-loader',
    options: {
      outputPath: 'fonts'
    }
  },
]

const devServer = 
{
  port: 3000,
  historyApiFallback: true,
  publicPath: 'http://localhost:3000',
  proxy: 
  {
    "/api/*":  
    {
      target: 'http://localhost:4000',
    },
    "/images/*":
    {
      target: 'http://localhost:4000',
    }
  }
}

module.exports = 
{
  mode: "development",
  devtool: 'inline-source-map',
  devServer: devServer,
  entry: path.resolve(__dirname, "./src/index.js"),
  output: 
  {
    path: __dirname + '/build',
    publicPath: '/',
    filename: "bundle.js"
  },
  plugins: plugins,
  module: 
  {
    rules: rules,
  }
}
