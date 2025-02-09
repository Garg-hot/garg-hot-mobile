const { getDefaultConfig } = require('expo/metro-config');

// /** @type {import('expo/metro-config').MetroConfig} */
// const config = getDefaultConfig(__dirname);

// module.exports = config;

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.assetExts.push('Cjs');

module.exports = defaultConfig;