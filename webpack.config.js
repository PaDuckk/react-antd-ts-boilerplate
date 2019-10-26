var path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const fs = require('fs')
const lessToJs = require('less-vars-to-js')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
var CompressionPlugin = require('compression-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const FOLDER_BUILD = 'lib'

// use ant-theme-var in components package
// const themeVariables = lessToJs(
//   fs.readFileSync(path.join(__dirname, '../components/src/theme/ant-theme-vars.less'), 'utf8')
// )

module.exports = (env, options) => {
  const dotEnvMode = 'development'
  if (env && env.production) {
    dotEnvMode = 'production'
  }

  const entryFilePath = './src/index.tsx'

  var config = {
    entry: {
      app: entryFilePath
    },
    output: {
      path: path.resolve(__dirname, FOLDER_BUILD),
      filename: '[name].[hash].bundle.js',
      chunkFilename: '[name].[chunkhash].bundle.js'
    },
    resolve: {
      alias: {
        'react-dom': '@hot-loader/react-dom'
      },
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.less']
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/,
          use: ['source-map-loader'],
          enforce: 'pre',
          exclude: /node_modules/
        },

        {
          test: /\.(ts|js)x?$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader'
            }
          ]
        },
        {
          test: /\.less$/,
          use: [
            'style-loader',
            { loader: 'css-loader', options: { sourceMap: false } },
            {
              loader: 'less-loader',
              options: {
                // sourceMap: true,
                javascriptEnabled: true
                // modifyVars: themeVariables
              }
            }
          ]
        },
        {
          test: /\.css$/,
          use: ['style-loader', { loader: 'css-loader', options: { sourceMap: false } }]
        }
      ]
    },
    plugins: [
      // new Dotenv({
      //   path: `./.env.${dotEnvMode}`
      // }),
      new HtmlWebpackPlugin({
        // Also generate a test.html
        // filename: 'test.html',
        // favicon: './static/favicon.ico',
        template: './static/index.html'
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
  }

  if (options.mode == 'development') {
    config.plugins.push(new webpack.HotModuleReplacementPlugin())
    config.devtool = 'inline-source-map'
    config.devServer = {
      host: '0.0.0.0',
      port: 3000,
      hot: true,
      stats: 'minimal', //'minimal' //'normal', // 'verbose'
      open: 'Google Chrome',
      historyApiFallback: true
    }
  } else {
    config.plugins.push(new CleanWebpackPlugin([FOLDER_BUILD]))
    config.plugins.push(new CompressionPlugin())
  }

  if (options['analysis_bundle']) {
    config.plugins.push(
      new BundleAnalyzerPlugin({
        // analyzerHost: '127.0.0.1',
        analyzerPort: 8080
      })
    )
  }

  return config
}
