const {transform}=require('../format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'manor',
    transform,
    domain: 'manor.ch',
    zipcode: "''",
  },
};
