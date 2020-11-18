const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IE',
    store: 'tesco',
    transform,
    domain: 'tesco.ie',
    zipcode: '',
  },
};
