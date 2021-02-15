const { implementation } = require('./testGotoWithRetries');
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'fnac.fr',
    timeout: 80000,
    country: 'FR',
    store: 'fnac',
    zipcode: "''",
  },
  implementation,
};
