const path = require('path');
module.exports = {
  parameters: null,
  inputs: null,
  dependencies: null,
  implementation: null,
  preCompileFunctions: {
    getRobotTemplateName: () => {
      const separator = path.sep;
      const rootFolder = 'library';
      const rootPath = __dirname.split(separator)
        .slice(0, __dirname.split(separator).indexOf(rootFolder) + 1)
        .join(separator);
      return Object.keys(require.cache)
        .filter(u => !u.split(separator).includes('node_modules'))
        .filter(u => u.includes(rootPath))[0]
        .split(rootPath)
        .slice(-1)[0]
        .split(separator)
        .filter(u => !u.includes('.'))
        .join(separator);
    },
  },
};
