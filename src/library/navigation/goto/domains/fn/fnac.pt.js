const { implementation } = require('./commonGoto');
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'fnac.pt',
    timeout: 800000,
    country: 'PT',
    store: 'fnac',
    zipcode: '',
  },
  implementation
};
