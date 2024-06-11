const fs = require('fs');
const path = require('path');

const ts = require('rollup-plugin-ts');
const terser = require('@rollup/plugin-terser');

const config = require('./tsconfig.json');

const filters = ['docs'];

const toBuild = process.argv[3];

const packages = fs.readdirSync('./packages').filter(dir => {
  // Skip if in filters list or not the specific package to build
  if (filters.includes(dir) || (toBuild && toBuild !== dir)) {
    return false;
  }

  const dirPath = path.join('./packages', dir);

  // Check if the directory is actually a directory
  if (!fs.statSync(dirPath).isDirectory()) {
    return false;
  }

  // Check if package.json exists in the directory
  const packageJsonPath = path.join(dirPath, 'package.json');
  return fs.existsSync(packageJsonPath);
});

const packageConfigs = packages.map(packageName => {
  return {
    input: `./packages/${packageName}/src/index.ts`,
    output: [
      {
        name:
          JSON.parse(fs.readFileSync(`./packages/${packageName}/package.json`)).buildName ??
          packageName,
        file: `./packages/${packageName}/dist/index.js`,
        format: 'umd',
        sourcemap: true
      }
    ],
    plugins: [ts(config), terser()]
  };
});

module.exports = packageConfigs;
