'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const WebpackManifestPlugin = require('webpack-manifest-plugin')
const yaml = require('js-yaml')
const FindReplacePlugin = require('find-replace-webpack-plugin')

const mapAppVersion = require('../package.json').version

const env = require('../config/prod.env')

let filesData = {}

const webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new VueLoaderPlugin(),
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },
      sourceMap: config.build.productionSourceMap,
      parallel: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      // set the following option to `true` if you want to extract CSS from
      // codesplit chunks into this main css file as well.
      // This will result in *all* of your app's CSS being loaded upfront.
      allChunks: false,
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    // keep module.id stable when vender modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks (module) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    // This instance extracts shared chunks from code splitted chunks and bundles them
    // in a separate chunk, similar to the vendor chunk
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 3
    }),

    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ]),
    
    // manifest yml file used to update 'getfarmcreditmap.libraries.yml'
    new WebpackManifestPlugin({
      fileName: 'getfarmcreditmap.libraries.yml',
      filter: (manifest) => {
        // console.log(manifest)
        switch (manifest.name) {
          case 'app.css':
          case 'app.js':
          case 'vendor.js':
          case 'manifest.js':
            return manifest.name
            break
          default: return false
        }
      },
      // seed: {
        
      // },
      generate: (seed, files) => {
        // console.log(files)
        const libaryTemplate = {
          'getfarmcredit-vue': {
            version: 1.0,
            'js': {
              'js/agf_config.js': {}
            },
            'css': {
              theme: {}
            }
          },
          'type-kit': {
            remote: 'https://typekit.com',
            license: {
              name: 'Adobe',
              url: 'https://helpx.adobe.com/typekit/using/font-licensing.html',
              'gpl-compatible': false
            },
            css: {
              theme: {
                'https://use.typekit.net/aqh0bgp.css': {
                  type: 'external',
                  minified: true
                }
              }
            }
          }
        }

        let reduced = files.reduce((manifest, {name, path}) => {
          path.slice(8).substr(0,3) === 'js/' ? libaryTemplate['getfarmcredit-vue']['js'][path.slice(8)] = {}
            : libaryTemplate['getfarmcredit-vue']['css']['theme'][path.slice(8)] = {}

          let fileName = path.slice(8).split('/')[1]

          let fileNameSplit = path.slice(8).split('/')[1].split('.')

          if (fileNameSplit[0] === 'manifest') {
            filesData.manifest = fileName
          }

          if (fileNameSplit[0] === 'vendor') {
            filesData.vendor = fileName
          }

          if (fileNameSplit[0] === 'app' && fileNameSplit[2] === 'css') {
            filesData.css = fileName
          }

          if (fileNameSplit[0] === 'app' && fileNameSplit[2] === 'js') {
            filesData.app = fileName
          }

          const newManifest = { ...manifest, ...libaryTemplate }
          return newManifest

        }, seed)

        const fixedOrder = {}

        Object.keys(reduced['getfarmcredit-vue']['js'])
          .sort((keyA, keyB)=> {
            // DONT MESS WITH THIS UNLESS YOU KNOW WHAT YOURE DOING :D
            if (keyA.slice(3).split('.')[0] === 'agf_config') return -1
            if (keyA.slice(3).split('.')[0] === 'manifest') return -1
            if (keyB.slice(3).split('.')[0] === 'manifest') return 1
            return 0
          }).forEach(key => {
            fixedOrder[key] = {}
          })

        const finalManifest = Object.assign(reduced, {'getfarmcredit-vue': {
          version: mapAppVersion,
          js: {...fixedOrder},
          css: {...reduced['getfarmcredit-vue']['css']}
        }})

        return finalManifest;
      },
      serialize: (manifest) => yaml.safeDump(manifest)
    }),
    new FindReplacePlugin({
			src: 'getfarmcreditmap.js.tpl',
			dest: 'dist/getfarmcreditmap.js',
			rules: [
				{
					find: /__VAR_STYLE__/g,
					replace(stats, match, name, dothash, hash, ext) {
						return filesData.css
					}
        },
        {
					find: /__VAR_APP__/g,
					replace(stats, match, name, dothash, hash, ext) {
						return filesData.app
					}
        },
        {
					find: /__VAR_MANIFEST__/g,
					replace(stats, match, name, dothash, hash, ext) {
						return filesData.manifest
					}
        },
        {
					find: /__VAR_VENDOR__/g,
					replace(stats, match, name, dothash, hash, ext) {
						return filesData.vendor
					}
				}
			]
		})
  ]
})

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
