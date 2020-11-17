const path = require('path');
const Resolve = function(fileName) {
	return path.join(__dirname, fileName);
};
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
	mode: 'development',
    entry: Resolve('./js/index.js'),
    devtool:'cheap-module-eval-source-map',
	output: {
		filename: 'index.js',
		path: Resolve('dist') // string
	}, 
	module: {
		rules: [
			{
                test: /\.js$/, 
                exclude:/node_modules/,
				loader: 'babel-loader'
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: [
					// {
					// 	loader: 'file-loader',
					// 	options: {
					// 		name: '[name]_[hash].[ext]',
					//         outputPath: './images',
					//         publicPath:'./images'
					// 	}
					// },
					{
						loader: 'url-loader',
						options: {
							name: '[name]_[hash:8].[ext]',
							outputPath: './images',
							// publicPath:'./images',
							limit: 10 //100KB
						}
					}
				]
			},
			{ test: /\.css$/, use: ['style-loader', 'css-loader'] },
			{
				test: /\.(scss|sass)$/,
				use: [
					{
						loader: 'style-loader',
					},
					{ loader: 'css-loader' },
					{ loader: 'postcss-loader' },
					{ loader: 'sass-loader' }
				]
			}
		]
    },
    devServer:{
        contentBase:Resolve('dist'),
        compress: true,    // 是否使用gzip压缩
        port: 9000,    // 端口号
        open : true   // 自动打开网页
    },
	plugins: [
		new HtmlWebpackPlugin({
			template: './index.html'
		}),
		new CleanWebpackPlugin()
	]
};
