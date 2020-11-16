const { cleanUp } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'GR',
    store: 'ab',
    transform: cleanUp,
    domain: 'ab.gr',
  },
};
