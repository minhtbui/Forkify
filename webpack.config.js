const path = require('path');   
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: ['./src/js/index.js'],
    output: {
        path: path.resolve(__dirname, 'dist'), //path the index file to dist folder
        filename: 'js/bundle.js'
    },
    devServer:{
        contentBase: './dist' //working on dev server localHost
    },
    plugins:[
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ],
    module:{
        rules: [
            {
                test: /\.js$/, //apply .js files
                exclude: /node_modules/, //exclude node modules folder
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
};


