const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  mode: 'development',
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, 'dist')   
  },
  plugins: [   
    new webpack.DefinePlugin({
      MULTISIG_ADDRESS: JSON.stringify(fs.readFileSync('MultisigAddress', 'utf8').replace(/\n|\r/g, "")),
      MULTISIG_ABI: fs.existsSync('MultisigABI') && fs.readFileSync('MultisigABI', 'utf8'),
      TEST_ADDRESS: JSON.stringify(fs.readFileSync('TestAddress', 'utf8').replace(/\n|\r/g, "")),
      TEST_ABI: fs.existsSync('TestABI') && fs.readFileSync('TestABI', 'utf8'),
    }),
    new CopyWebpackPlugin([{ from: "./src/index.html", to: "index.html"}]),
  ],
  devServer: { contentBase: path.join(__dirname, "dist"), compress: true }
}