const {transform} = require('../RS/format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RS',
    store: 'maxi',
    transform,
    domain: 'maxi.rs',
    zipcode: '',
  },
};
