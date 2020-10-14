const {transform}=require('../format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'hulpmiddelwereld',
    transform,
    domain: 'hulpmiddelwereld.nl',
    zipcode: '',
  },
};
