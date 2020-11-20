
module.exports = {
  parameters: null,
  inputs: null,
  dependencies: null,
  implementation: null,
  preCompileFunctions: {
    getRobotTemplateName: () => {
      const rootFolder = 'library';
      const rootPath = __dirname.split('/')
        .slice(0, __dirname.split('/').indexOf(rootFolder) + 1)
        .join('/');

      return Object.keys(require.cache)
        .filter(u => !u.split('/').includes('node_modules'))
        .filter(u => u.includes(rootPath))[0]
        .split(rootPath)
        .slice(-1)[0]
        .split('/')
        .filter(u => !u.includes('.'))
        .join('/');
    },
  },
};
