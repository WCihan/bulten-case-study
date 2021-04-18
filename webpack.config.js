const path = require('path');
const webpack = require('webpack');
const resolve = require('resolve');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = function (webpackEnv) {
	const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
	const isProd = webpackEnv === 'production';
	const isDev = !isProd;

	const HTMLWebpackPluginConfig = new HTMLWebpackPlugin(
		Object.assign(
			{},
			{
				inject: true,
				template: path.resolve(__dirname, './public/index.html'),
				filename: './index.html',
				favicon: './public/favicon.ico'
			},
			isProd
				? {
						minify: {
							removeComments: true,
							collapseWhitespace: true,
							removeRedundantAttributes: true,
							useShortDoctype: true,
							removeEmptyAttributes: true,
							removeStyleLinkTypeAttributes: true,
							keepClosingSlash: true,
							minifyJS: true,
							minifyCSS: true,
							minifyURLs: true
						}
				  }
				: undefined
		)
	);

	const MiniCssExtractPluginOptions = new MiniCssExtractPlugin({
		filename: 'static/css/[name].css',
		chunkFilename: 'static/css/[name].chunk.css'
	});

	function getStyleLoaders(options) {
		return [
			{
				loader: MiniCssExtractPlugin.loader
			},
			{
				loader: 'css-loader',
				options: options
			},
			{
				loader: 'postcss-loader',
				options: {
					postcssOptions: {
						plugins: [require('postcss-preset-env')(), require('autoprefixer')]
					},
					sourceMap: isProd && shouldUseSourceMap
				}
			},
			{
				loader: 'sass-loader',
				options: {
					sourceMap: isProd && shouldUseSourceMap
				}
			}
		];
	}

	function getPlugins() {
		const plugins = [
			new CleanWebpackPlugin(),
			HTMLWebpackPluginConfig,
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': '"development"',
				'process.env.BABEL_ENV': '"development"'
			}),
			MiniCssExtractPluginOptions
		];

		if (isDev) {
			plugins.push(new webpack.HotModuleReplacementPlugin());
		}

		return plugins;
	}

	return {
		mode: isDev ? 'development' : 'production',
		target: 'web',
		bail: isProd,
		entry: './src/index.tsx',
		devtool: isProd ? (shouldUseSourceMap ? 'source-map' : false) : isDev && 'eval',
		plugins: getPlugins(),
		module: {
			rules: [
				{
					test: /\.(js|jsx|ts|tsx)$/,
					enforce: 'pre',
					use: [
						{
							loader: 'babel-loader',
							options: {
								cacheDirectory: true,
								cacheCompression: isProd,
								compact: isProd
							}
						},
						{
							options: {
								eslintPath: require.resolve('eslint')
							},
							loader: 'eslint-loader'
						}
					],
					include: /src/
				},
				{
					test: /\.js$/,
					include: /src/,
					loader: 'source-map-loader',
					enforce: 'pre'
				},
				{
					test: /\.(css)$/,
					include: /src/,
					use: getStyleLoaders({
						importLoaders: 1,
						sourceMap: isProd && shouldUseSourceMap
					}),
					sideEffects: true
				},
				{
					test: /\.(s[ac]ss)$/,
					include: /src/,
					use: getStyleLoaders({
						importLoaders: 2,
						sourceMap: isProd && shouldUseSourceMap
					}),
					sideEffects: true
				},
				{
					test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
					exclude: /node_modules/,
					use: {
						loader: 'file-loader',
						options: {
							name: '[name].[ext]'
						}
					}
				}
			]
		},
		optimization: {
			minimize: isProd,
			minimizer: [
				`...`,
				new TerserJSPlugin({
					parallel: true,
					terserOptions: {
						sourceMap: shouldUseSourceMap
					}
				}),
				new CssMinimizerPlugin({ parallel: true })
			],
			splitChunks: {
				chunks: 'all',
				name: false
			},
			runtimeChunk: 'single',
			moduleIds: 'deterministic',
			mangleWasmImports: true,
			removeAvailableModules: false
		},
		resolve: {
			extensions: ['.tsx', '.ts', '.js'],
			modules: ['node_modules']
		},
		output: {
			path: path.resolve('dist'),
			filename: '[name].bundle.js',
			publicPath: '/',
			clean: true
		},
		performance: false,
		devServer: {
			port: 8080,
			contentBase: path.resolve(__dirname, 'dist'),
			watchContentBase: true,
			hot: true,
			hotOnly: true,
			quiet: true,
			overlay: false,
			compress: true,
			open: true,
			inline: true,
			stats: 'minimal',
			historyApiFallback: true
		}
	};
};
