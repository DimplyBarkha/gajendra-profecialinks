const {transform}=require('../GR/format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'GR',
    store: 'sephora',
    transform,
    domain: 'sephora.gr',
    zipcode: '',
  },
};
