const { transform } = require('../format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'zooroyal',
    transform,
    domain: 'zooroyal.de',
    zipcode: '',
  },
};
