const path = require('path');

module.exports = {
  entry: './dist/index.js', // Your entry file
  output: {
    filename: 'index.js', // Output file
    path: path.resolve(__dirname, 'deploy'),
  },
  target: 'node', // Ensures compatibility with Node.js
  mode: 'production',
  externals: {
    // Possible drivers for knex - we'll ignore them
    sqlite3: 'sqlite3',
    mysql2: 'mysql2',
    mariasql: 'mariasql',
    mysql: 'mysql',
    oracle: 'oracle',
    'strong-oracle': 'strong-oracle',
    oracledb: 'oracledb',
    // pg: 'pg',
    'pg-native': 'pg-native',
    'pg-query-stream': 'pg-query-stream',
    'tedious': 'tedious',
    'better-sqlite3': 'better-sqlite3',
  },
  optimization: {
    splitChunks: false, // Disable code splitting
  },
  module: {
    rules: [
      {
        test: /\.(d.ts)$/,
        use: [
          {
            loader: 'null-loader',
          },
        ],
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
