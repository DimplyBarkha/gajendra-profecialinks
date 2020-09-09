const transform = require('../../../w/walmart/US/transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'fust',
    transform: transform,
    domain: 'fust.ch',
    zipcode: '',
  },
};
