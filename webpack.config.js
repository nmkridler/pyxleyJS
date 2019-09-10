const path = require('path');
var webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve('build'),
    filename: 'pyxley.js',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use:  [{
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/env', '@babel/react'],
                    plugins: [
                      ['import', {
                        libraryName: "antd",
                        libraryDirectory: "es",
                        style: true}]
                  ]
               }
            }],
        },
        {
            test: /\.less$/,
            use: [
              {loader: 'style-loader'},
              {loader: 'css-loader'},
              {loader: 'less-loader'},
            ]
        }

    ]
  },
  resolve: {
    extensions: ['.js'],
  },
  externals: [
    {"plotly\.js": "Plotly"},
    {"react-plotly.js": "Plot"},
    {'react': {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react'}
    },
    {'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom'}
    },
    {antd: "antd"},
    {"react-redux": "react-redux"},
    {redux: "redux"},
    {moment: "moment"}
  ],
  optimization: {
    minimize: true
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru/)
  ]
};
