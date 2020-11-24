const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'HU',
    store: 'tesco',
    transform,
    domain: 'tesco.hu',
    zipcode: '',
  },
};
