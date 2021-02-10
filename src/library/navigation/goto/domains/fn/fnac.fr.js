const { implementation } = require('./commonGoto');
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'fnac.fr',
    timeout: 60000,
    country: 'FR',
    store: 'fnac',
    zipcode: "''",
  },
  implementation,
};
