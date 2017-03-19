var { resolve } = require('path');
var webpack = require('webpack');

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

function getEntrySources(sources) {
	if (process.env.NODE_ENV !== 'production') {
		sources.push('webpack-dev-server/client?http://localhost:8080');
		sources.push('webpack/hot/only-dev-server');
	}
	return sources;
}

module.exports = {
	entry: getEntrySources(['./src/app.js']),

	output: {
		filename: 'bundle.js',
		path: resolve(__dirname, 'build'),
		publicPath: '/'
	},

	"start": "webpack-dev-server",

	devtool: 'source-map',

	devServer: {
		inline: true,
		hot: true,
		contentBase: resolve(__dirname, 'build'),
		publicPath: '/'
	},

	module: {
		preLoaders: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'source-map'
			}
		],
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loaders: ['react-hot', 'babel-loader?presets[]=es2015,presets[]=react,presets[]=stage-0'],
			},
			{
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract(
					'style-loader',
					'css-loader?sourceMap!autoprefixer?browsers=last 3 versions!sass-loader?sourceMap'
				)
				/*
				loaders: [
					'style',
					'css?sourceMap',
					'autoprefixer?browsers=last 3 versions',
					'sass?sourceMap'
				]
				*/
			},
			{
				test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/, 
				loader: 'file-loader?name=fonts/[name].[ext]'
			},
			{
				test: /\.(png|jpg|jpeg)$/,
				loader: 'url-loader'
			}
		]
	},

	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new ExtractTextPlugin("styles.css"),
		new CopyWebpackPlugin([{from: 'src/assets/', force: true}], {copyUnmodified: true})
	]
};