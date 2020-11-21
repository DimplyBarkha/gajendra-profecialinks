const {transform} = require('../RS/format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RS',
    store: 'maxi',
    transform,
    domain: 'maxi.rs',
    zipcode: '',
  },
};
