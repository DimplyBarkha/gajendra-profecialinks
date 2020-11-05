const { cleanup } = require('../../../../shared');

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IE',
    store: 'soundstore',
    transform: cleanup,
    domain: 'soundstore.ie',
    zipcode: '',
  },
};
