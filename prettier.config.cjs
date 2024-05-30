/* eslint-disable */
const customAppConfig = require('./customizeUtils/custom-app.config.cjs');
module.exports = require(`./node_modules/${customAppConfig.targetDependency}/prettier.config.cjs`);
