
const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'myer',
    transform: transform,
    domain: 'myer.com.au',
    zipcode: '',
  },
};
