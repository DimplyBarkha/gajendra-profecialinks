const {transform}= require('../IL/format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IL',
    store: 'super-pharm',
    transform,
    domain: 'super-pharm.co.il',
    zipcode: '',
  },
};
