const {transform}=require('../format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'rei',
    transform,
    domain: 'rei.com',
    zipcode: '',
  },
};
