const { transform } = require('./shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'aboutyou',
    transform,
    domain: 'aboutyou.de',
    zipcode: '',
  },
};
