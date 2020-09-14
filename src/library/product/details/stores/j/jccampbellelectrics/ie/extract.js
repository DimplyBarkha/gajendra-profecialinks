const { transform } = require('../../../w/walmart/US/transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ie',
    store: 'jccampbellelectrics',
    transform: transform,
    domain: 'jccampbellelectrics.com',
    zipcode: '',
  },
};
