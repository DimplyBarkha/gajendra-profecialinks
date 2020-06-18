const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'amazonApparelApp',
    transform: transform,
    domain: 'amazon.de',
  },
};
