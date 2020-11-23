const {transform}=require('../IL/format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IL',
    store: 'super-pharm',
    transform,
    domain: 'super-pharm.co.il',
    zipcode: '',
  },
};
