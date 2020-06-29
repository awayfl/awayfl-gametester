const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const Terser = require('terser-webpack-plugin')
const tsloader = require.resolve('ts-loader');
const merge = require("webpack-merge");

module.exports = (env = {}) => {

	var isProd = !!env.prod;

	const entry = {};
	entry["GameTesterAVMPlayer"] = ["./src/GameTesterAVMPlayer.ts"];

	
	const common = {

		entry: entry,

		output: {
			pathinfo: false,
			path: path.join(__dirname, "static", "avms", "scripts", "away"),
			filename: '[name].js'
		},
		resolve: {
			// Add `.ts` and `.tsx` as a resolvable extension.
			extensions: ['.webpack.js', '.web.js', '.js', '.ts', '.tsx']
		},
		module: {
			rules: [
				// all files with a `.ts` or `.tsx` extension will be handled by `tsloader`
				{ test: /\.ts(x?)/, exclude: /node_modules/, loader: tsloader, options: { experimentalWatchApi: true} },

				// all files with a `.js` or `.jsx` extension will be handled by `source-map-loader`
				//{ test: /\.js(x?)/, loader: require.resolve('source-map-loader') }
			]
		},
		plugins: [],

		performance: {
			hints: false // wp4
		},
		stats: {
			cached: true, // wp4
			errorDetails: true, // wp4
			colors: true // wp4
		},
		devServer: {
			progress: true, // wp4
		},


	}

	const dev = {
		mode: "development",// wp4
		devtool: 'source-map',
		//devtool: 'cheap-module-eval-source-map',//use this option for recompiling libs
		devServer: {
			contentBase: path.join(process.cwd(), "src"),
			inline: true,
			publicPath: "/",
			open: false,
			progress: true,

		},
		optimization: {
			//minimize: false // wp4
		}
	}

	const prod = {
		mode: "production",// wp4
		bail: true
	};

	if(Terser) {
		prod.optimization = {
			minimize: true,
			minimizer: [
				new Terser({
				  extractComments: {
					condition: /^\**!|@preserve|@license|@cc_on/i,
					filename: 'LICENSES.txt'
				  },
				}),
			],
		}
	} else {
		console.warn("TERSER IS REQUIRE FOR REMOVING COMMENTS!");
	}

	return merge(common, isProd ? prod : dev);

}
