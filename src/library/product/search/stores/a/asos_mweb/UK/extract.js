
const { transform } = require('../../../../shared');
const { implementation } = require('../../asos/extractImplementation');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'asos_mweb',
    transform: transform,
    domain: 'asos.com',
  },
  implementation,
};
