const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'drankdozijn',
    transform,
    domain: 'drankdozijn.nl',
  },
};
